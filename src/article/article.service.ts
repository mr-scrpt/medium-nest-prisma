import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommonService } from '@app/common/common.service';
import { UserService } from '@app/user/user.service';
import { Token } from '@app/auth/iterface/auth.interface';
import { ArticleRepository } from './article.repository';
import { ArticleCreateDto } from './dto/articleCreate.dto';
import { ArticleToDBDto } from './dto/db/articleToDB.dto';
import { ArticlePrepareCreateDto } from './dto/articlePrepate.dto';
import { ArticleWithRelationEntity } from './entity/aticleWithRelation.entity';
import { TagService } from '@app/tag/tag.service';
import { ArticleToTag } from '@prisma/client';
import { ArticleFullDataSerializedDto } from './dto/articleFullDataSerialized.dto';
import { IArticleQueryParamsRequered } from './article.interface';
import { ResArticeFeedDto } from './dto/resArticleFeed.dto';
import { ArticleRelationDataDto } from './dto/articleRelationData.dto';
import { ResArticleDto } from './dto/resArticle.dto';
import { ArticleUpdateDto } from './dto/articleUpdate.dto';
import { ArticlePrepareUpdateDto } from './dto/articlePrepateUpdate.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
    private readonly articleRepository: ArticleRepository,
    private readonly tagService: TagService,
  ) {}

  async getArticleAllByParamsAndToken(
    queryParams: IArticleQueryParamsRequered,
    token: Token,
  ): Promise<ResArticeFeedDto> {
    const currentUserId = this.userService.getUserIdFromToken(token);

    const [articles, articleCount] = await this.getArticleFeedWithCount(
      queryParams,
    );

    const data = await this.getArticlesFeedWithCompletedData(
      articles,
      currentUserId,
    );

    const buildData = this.buildArticlesFeedResponse(data, articleCount);
    return buildData;
  }

  async getArticleFollowByParamsAndToken(
    queryParams: IArticleQueryParamsRequered,
    token: Token,
  ): Promise<ResArticeFeedDto> {
    const currentUserId = this.userService.getUserIdFromToken(token);

    const [articles, articleCount] = await this.getArticleFollowWithCount(
      queryParams,
      currentUserId,
    );

    const data = await this.getArticlesFeedWithCompletedData(
      articles,
      currentUserId,
    );

    const buildData = this.buildArticlesFeedResponse(data, articleCount);
    return buildData;
  }

  async getArticleBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ResArticleDto> {
    const currentUserId = this.userService.getUserIdFromToken(token);
    const article = await this.checkAndGetArticleBySlug(slug);

    const data = await this.getArticleWithCompletdData(article, currentUserId);

    return this.buildArticleResponse(data);
  }

  async deleteArticleBySlugAndToken(slug: string, token: Token): Promise<void> {
    const currentUserId = this.userService.getUserIdFromToken(token);
    const article = await this.checkAndGetArticleBySlug(slug);

    this.checkArticleAuthor(article, currentUserId);

    await this.deleteArticleBySlug(article.slug);
  }

  async createArticleComplite(
    articleCreateDto: ArticleCreateDto,
    token: Token,
  ): Promise<ResArticleDto> {
    const cleanArtcle = this.cleanCreateArticleDto(articleCreateDto);
    const slug = this.genSlug(articleCreateDto.title);
    await this.checkUniqueArticleBySlug(slug);
    const currentUserId = this.userService.getUserIdFromToken(token);

    const [articleToDB, tagList] = this.prepareToCreateArticleAndTagList(
      cleanArtcle,
      slug,
      currentUserId,
    );

    const tagListNormolized = this.tagService.tagListNormolized(tagList);

    await this.createAndCheckArticle(articleToDB, tagListNormolized);

    const article = await this.getArticleBySlug(slug);

    const data = await this.getArticleWithCompletdData(article, currentUserId);

    return this.buildArticleResponse(data);
  }

  async updateArticleBySlugAndToken(
    slug: string,
    articleUpdateDto: ArticleUpdateDto,
    token: Token,
  ): Promise<ResArticleDto> {
    const articleClean = this.cleanUpdateArticleDto(articleUpdateDto);
    const currentUserId = this.userService.getUserIdFromToken(token);
    const article = await this.checkAndGetArticleBySlug(slug);

    this.checkArticleAuthor(article, currentUserId);

    const slugNew = await this.compareAndGetSlugNew(articleClean, slug);

    const [articleToDB, tagList] = this.prepareToUpdateArticleAndTagList(
      articleClean,
      slugNew,
      currentUserId,
    );

    const tagListNormolized = this.tagService.tagListNormolized(tagList);

    await this.updateAndCheckArticle(articleToDB, tagListNormolized, slug);

    const articleUpdated = await this.getArticleBySlug(slugNew);

    const data = await this.getArticleWithCompletdData(
      articleUpdated,
      currentUserId,
    );

    return this.buildArticleResponse(data);
  }

  async compareAndGetSlugNew(
    article: ArticleUpdateDto,
    slug: string,
  ): Promise<string> {
    if (article.title) {
      const slugNew = this.genSlug(article.title);
      if (slug !== slugNew) {
        await this.checkUniqueArticleBySlug(slugNew);
        return slugNew;
      }
    }
    return slug;
  }

  async addToFavoriteBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ResArticleDto> {
    const currentUserId = this.userService.getUserIdFromToken(token);

    await this.checkAndGetArticleBySlug(slug);

    const isFavorite = await this.isFavorited(slug, currentUserId);

    this.checkArticleInFavorites(isFavorite);

    await this.addArticleToFavorites(slug, currentUserId);

    const article = await this.getArticleBySlug(slug);

    console.log('article in service', article);
    const data = await this.getArticleWithCompletdData(article, currentUserId);

    return this.buildArticleResponse(data);
  }

  async deleteFromFavoriteBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ResArticleDto> {
    const currentUserId = this.userService.getUserIdFromToken(token);

    await this.checkAndGetArticleBySlug(slug);

    const isFavorite = await this.isFavorited(slug, currentUserId);

    this.checkArticleNotInFavorites(isFavorite);

    await this.deleteArticleFromFavorites(slug, currentUserId);

    const article = await this.getArticleBySlug(slug);

    const data = await this.getArticleWithCompletdData(article, currentUserId);

    return this.buildArticleResponse(data);
  }

  private async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<void> {
    const article = await this.articleRepository.addArticleToFavorites(
      slug,
      currentUserId,
    );
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }

  private async deleteArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<void> {
    const article = await this.articleRepository.removeArticleFromFavorites(
      slug,
      currentUserId,
    );
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }

  private checkArticleInFavorites(isFavorite: boolean): void {
    if (isFavorite) {
      throw new HttpException(
        'This article is already in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkArticleNotInFavorites(isFavorite: boolean): void {
    if (!isFavorite) {
      throw new HttpException(
        'This article is not in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async isFavorited(
    slug: string,
    currentUserId: number,
  ): Promise<boolean> {
    const article = await this.checkAndGetArticleBySlug(slug);
    const isInFavorites = article.favoritedBy.some((user) => {
      if (user.userId === currentUserId) {
        return true;
      }
    });

    if (isInFavorites) {
      return true;
    }

    return false;
  }

  private checkArticleAuthor(
    article: ArticleWithRelationEntity,
    currentUserId: number,
  ): void {
    if (article.author?.id !== currentUserId) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async deleteArticleBySlug(slug: string): Promise<void> {
    try {
      await this.articleRepository.deleteArticleBySlug(slug);
    } catch (error) {
      throw new HttpException(
        'Article not deleted',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getArticleBySlug(
    slug: string,
  ): Promise<ArticleWithRelationEntity> {
    return await this.articleRepository.getArticleBySlug(slug);
  }

  private async checkAndGetArticleBySlug(
    slug: string,
  ): Promise<ArticleWithRelationEntity> {
    const article = await this.getArticleBySlug(slug);

    if (!article) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return article;
  }

  private async checkUniqueArticleBySlug(slug: string): Promise<void> {
    const article = await this.articleRepository.getArticleBySlug(slug);

    if (article) {
      throw new HttpException(
        'Article with this slug already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private buildArticlesFeedResponse(
    articles: ArticleFullDataSerializedDto[],
    articlesCount: number,
  ): ResArticeFeedDto {
    return { articles, articlesCount };
  }

  private async getArticlesFeedWithCompletedData(
    articles: ArticleWithRelationEntity[],
    currentUserId: number | null,
  ): Promise<ArticleFullDataSerializedDto[]> {
    const result: ArticleFullDataSerializedDto[] = [];
    for await (const article of articles) {
      result.push(
        await this.getArticleWithCompletdData(article, currentUserId),
      );
    }
    return result;
  }

  private async getArticleWithCompletdData(
    article: ArticleWithRelationEntity,
    currentUserId: number | null,
  ): Promise<ArticleFullDataSerializedDto> {
    const articleWithFavorite = this.getArticleWithFavoritesData(
      article,
      currentUserId,
    );
    const tagListNames = await this.articleToTagList(article.tagList);

    return { ...articleWithFavorite, tagList: tagListNames };
  }

  private getArticleWithFavoritesData(
    article: ArticleWithRelationEntity,
    currentUserId: number | null,
  ): ArticleRelationDataDto {
    const favorited = article.favoritedBy.some((user) => {
      return user.userId === currentUserId;
    });
    delete article.favoritedBy;
    return {
      ...article,
      favorited,
    };
  }

  private async getArticleFeedWithCount(
    queryParams: IArticleQueryParamsRequered,
  ): Promise<[ArticleWithRelationEntity[], number]> {
    return await Promise.all([
      await this.articleRepository.getArticleAllByParams(queryParams),
      await this.articleRepository.countFeed(queryParams),
    ]);
  }

  private async getArticleFollowWithCount(
    queryParams: IArticleQueryParamsRequered,
    currentUserId: number,
  ): Promise<[ArticleWithRelationEntity[], number]> {
    return await Promise.all([
      await this.articleRepository.getArticleFollowByParams(
        queryParams,
        currentUserId,
      ),
      await this.articleRepository.countFollow(currentUserId),
    ]);
  }

  private cleanUpdateArticleDto(
    articleUpdateDto: ArticleUpdateDto,
  ): ArticleUpdateDto {
    const { title, body, description, tagList } = articleUpdateDto;
    return { title, body, description, tagList };
  }
  private cleanCreateArticleDto(
    articleUpdateDto: ArticleCreateDto,
  ): ArticleCreateDto {
    const { title, body, description, tagList } = articleUpdateDto;
    return { title, body, description, tagList };
  }

  private buildArticleResponse(
    article: ArticleFullDataSerializedDto,
  ): ResArticleDto {
    return { article };
  }

  async articleToTagList(articleToTag: ArticleToTag[]): Promise<string[]> {
    if (!articleToTag.length) {
      return [];
    }
    return await this.tagService.getTagListByEntity(articleToTag);
  }

  private async createAndCheckArticle(
    articleToDB: ArticleToDBDto,
    tagList: string[],
  ): Promise<void> {
    const articleCreated =
      await this.articleRepository.createArticleTransaction(
        articleToDB,
        tagList,
      );
    if (!articleCreated) {
      throw new HttpException('Article not created', HttpStatus.BAD_REQUEST);
    }
  }

  private async updateAndCheckArticle(
    articleToDB: ArticleToDBDto,
    tagList: string[],
    slug: string,
  ): Promise<void> {
    const articleUpdated =
      await this.articleRepository.updateArticleTransaction(
        articleToDB,
        tagList,
        slug,
      );
    if (!articleUpdated) {
      throw new HttpException('Article not updated', HttpStatus.BAD_REQUEST);
    }
  }

  private prepareToCreateArticleAndTagList(
    articleCreateDto: ArticleCreateDto,
    slug: string,
    currentUserId: number,
  ): [ArticleToDBDto, string[]] {
    const { tagList, ...article } = articleCreateDto;
    const articeToDB = this.prepareAtricleToCreateDb(
      article,
      slug,
      currentUserId,
    );
    return [articeToDB, tagList];
  }

  private prepareToUpdateArticleAndTagList(
    articleCreateDto: ArticleUpdateDto,
    slug: string,
    currentUserId: number,
  ): [ArticleToDBDto, string[]] {
    const { tagList, ...article } = articleCreateDto;
    const articeToDB = this.prepareAtricleToUpdateDb(
      article,
      slug,
      currentUserId,
    );
    return [articeToDB, tagList];
  }

  private prepareAtricleToCreateDb(
    articleCreateDto: ArticlePrepareCreateDto,
    slug: string,
    authorId: number,
  ): ArticleToDBDto {
    const { title, body, description } = articleCreateDto;
    return { title, body, description, authorId, slug };
  }

  private prepareAtricleToUpdateDb(
    articleCreateDto: ArticlePrepareUpdateDto,
    slug: string,
    authorId: number,
  ): ArticleToDBDto {
    const { title, body, description } = articleCreateDto;
    return { title, body, description, authorId, slug };
  }

  private genSlug(title: string): string {
    return this.commonService.slugGenerator(title);
  }

  // async getTestArticle(): Promise<void> {
  //   await this.articleRepository.getArticles();
  // }
}
