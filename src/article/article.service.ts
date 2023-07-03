import { Injectable } from '@nestjs/common';
import { CommonService } from '@app/common/common.service';
import { UserService } from '@app/user/user.service';
import { TagService } from '@app/tag/tag.service';
import { ArticleRepository } from '@app/article/article.repository';
import { ArticleToTag } from '@prisma/client';
import { IArticleQueryParamsRequered } from '@app/article/article.interface';
import { ArticleTransaction } from '@app/article/article.transaction';
import { ArticleCheck } from '@app/article/article.check';
import { Token } from '@app/auth/iterface/auth.interface';
import { ArticleWithRelationEntity } from '@app/article/entity/aticleWithRelation.entity';
import { ResArticeFeedDto } from '@app/article/dto/resArticleFeed.dto';
import { ArticleRelationDataDto } from '@app/article/dto/articleRelationData.dto';
import { ResArticleDto } from '@app/article/dto/resArticle.dto';
import { ArticleUpdateDto } from '@app/article/dto/articleUpdate.dto';
import { ArticlePrepareUpdateDto } from '@app/article/dto/articlePrepateUpdate.dto';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { ArticleToDBDto } from '@app/article/dto/db/articleToDB.dto';
import { ArticlePrepareCreateDto } from '@app/article/dto/articlePrepate.dto';
import { ArticleFullDataSerializedDto } from '@app/article/dto/articleFullDataSerialized.dto';
import { CommentCreateDto } from '@app/comment/dto/commentCreate.dto';
import { ResCommentDto } from '@app/comment/dto/resComment.dto';
import { CommentService } from '@app/comment/comment.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly commonService: CommonService,
    private readonly userService: UserService,
    private readonly articleRepository: ArticleRepository,
    private readonly tagService: TagService,
    private readonly articleTransaction: ArticleTransaction,
    private readonly articleCheck: ArticleCheck,
    private readonly commentService: CommentService,
  ) {}

  async getArticleAllByParamsAndToken(
    queryParams: IArticleQueryParamsRequered,
    token: Token,
  ): Promise<ResArticeFeedDto> {
    const currentUserId = this.userService.getUserIdFromToken(token);

    const [articles, articleCount] = await this.getArticleFeedWithCount(
      queryParams,
    );

    const articleComplete = await this.getArticlesFeedWithCompletedData(
      articles,
      currentUserId,
    );

    return this.buildArticlesFeedResponse(articleComplete, articleCount);
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

    const articleComplete = await this.getArticlesFeedWithCompletedData(
      articles,
      currentUserId,
    );

    return this.buildArticlesFeedResponse(articleComplete, articleCount);
  }

  async getArticleBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ResArticleDto> {
    await this.checkExistArticleBySlug(slug);

    const currentUserId = this.userService.getUserIdFromToken(token);
    const article = await this.getArticleBySlug(slug);

    const articleComplete = await this.getArticleWithCompletdData(
      article,
      currentUserId,
    );

    return this.buildArticleResponse(articleComplete);
  }

  async createArticle(
    articleCreateDto: ArticleCreateDto,
    token: Token,
  ): Promise<ResArticleDto> {
    const slug = this.commonService.slugGenerator(articleCreateDto.title);
    await this.checkUniqueArticleBySlug(slug);

    const cleanArtcle = this.cleanCreateArticleDto(articleCreateDto);
    const currentUserId = this.userService.getUserIdFromToken(token);

    const [articleToDB, tagList] = this.prepareToCreateArticleAndTagList(
      cleanArtcle,
      slug,
      currentUserId,
    );

    const tagListNormolized = this.tagService.tagListNormolized(tagList);

    await this.articleTransaction.createArticleTransaction(
      articleToDB,
      tagListNormolized,
    );

    const article = await this.getArticleBySlug(slug);

    const articleComplete = await this.getArticleWithCompletdData(
      article,
      currentUserId,
    );

    return this.buildArticleResponse(articleComplete);
  }

  async deleteArticleBySlugAndToken(slug: string, token: Token): Promise<void> {
    await this.checkExistArticleBySlug(slug);

    const currentUserId = this.userService.getUserIdFromToken(token);
    const article = await this.getArticleBySlug(slug);

    this.checkIsAutour(article.author.id, currentUserId);

    await this.articleTransaction.deleteArticleTransaction(article.slug);
  }

  async updateArticleBySlugAndToken(
    slug: string,
    articleUpdateDto: ArticleUpdateDto,
    token: Token,
  ): Promise<ResArticleDto> {
    await this.checkExistArticleBySlug(slug);

    const articleClean = this.cleanUpdateArticleDto(articleUpdateDto);
    const currentUserId = this.userService.getUserIdFromToken(token);

    const { author } = await this.getArticleBySlug(slug);

    this.checkIsAutour(author.id, currentUserId);

    const slugNew = await this.compareAndGetSlugNew(articleClean, slug);

    const [articleToDB, tagList] = this.prepareToUpdateArticleAndTagList(
      articleClean,
      slugNew,
      currentUserId,
    );

    const tagListNormolized = this.tagService.tagListNormolized(tagList);

    await this.articleTransaction.updateArticleTransaction(
      articleToDB,
      tagListNormolized,
      slug,
    );

    const articleUpdated = await this.getArticleBySlug(slugNew);

    const articleComplete = await this.getArticleWithCompletdData(
      articleUpdated,
      currentUserId,
    );

    return this.buildArticleResponse(articleComplete);
  }

  async addToFavorite(slug: string, token: Token): Promise<ResArticleDto> {
    await this.checkExistArticleBySlug(slug);
    const article = await this.getArticleBySlug(slug);

    const currentUserId = this.userService.getUserIdFromToken(token);
    const isFavorite = await this.isFavorited(article, currentUserId);

    this.articleCheck.isInFavorites(isFavorite);

    await this.addArticleToFavorites(slug, currentUserId);

    const articleComplete = await this.getArticleWithCompletdData(
      article,
      currentUserId,
    );

    return this.buildArticleResponse(articleComplete);
  }

  async deleteFromFavorite(slug: string, token: Token): Promise<ResArticleDto> {
    await this.checkExistArticleBySlug(slug);
    const article = await this.getArticleBySlug(slug);

    const currentUserId = this.userService.getUserIdFromToken(token);
    const isFavorite = await this.isFavorited(article, currentUserId);

    this.articleCheck.isNotInFavorites(isFavorite);

    await this.deleteArticleFromFavorites(slug, currentUserId);

    const articleComplete = await this.getArticleWithCompletdData(
      article,
      currentUserId,
    );

    return this.buildArticleResponse(articleComplete);
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithRelationEntity> {
    return await this.articleRepository.getArticleBySlug(slug);
  }

  async createCommentBySlugAndToken(
    slug: string,
    commentCreateDto: CommentCreateDto,
    token: Token,
  ): Promise<ResCommentDto> {
    await this.checkExistArticleBySlug(slug);

    const currentUserId = this.userService.getUserIdFromToken(token);
    const article = await this.getArticleBySlug(slug);

    return await this.commentService.createComment(
      commentCreateDto,
      currentUserId,
      article.id,
    );
  }

  private async compareAndGetSlugNew(
    article: ArticleUpdateDto,
    slug: string,
  ): Promise<string> {
    if (article.title) {
      const slugNew = this.commonService.slugGenerator(article.title);
      if (slug !== slugNew) {
        await this.checkUniqueArticleBySlug(slugNew);
        return slugNew;
      }
    }
    return slug;
  }

  private async articleToTagList(
    articleToTag: ArticleToTag[],
  ): Promise<string[]> {
    if (!articleToTag.length) {
      return [];
    }
    return await this.tagService.getTagListByEntity(articleToTag);
  }

  private async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<void> {
    await this.articleRepository.addArticleToFavorites(slug, currentUserId);
  }

  private async deleteArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<void> {
    await this.articleRepository.removeArticleFromFavorites(
      slug,
      currentUserId,
    );
  }

  private async isFavorited(
    article: ArticleWithRelationEntity,
    currentUserId: number,
  ): Promise<boolean> {
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

  private async checkExistArticleBySlug(slug: string): Promise<void> {
    const article = await this.articleRepository.getArticleBySlug(slug);
    this.articleCheck.isExist(!!article);
  }

  private async checkUniqueArticleBySlug(slug: string): Promise<void> {
    const article = await this.articleRepository.getArticleBySlug(slug);
    this.articleCheck.isNotExist(!!article);
  }

  private checkIsAutour(authorId: number, currentUserId: number): void {
    const isAuthor = authorId === currentUserId;
    this.articleCheck.isAuthor(isAuthor);
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

  // Чистка данных
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

  // Подготовка данных
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
    return {
      authorId,
      slug,
      title,
      description,
      body,
    };
  }

  // Билдинг ответов
  private buildArticlesFeedResponse(
    articles: ArticleFullDataSerializedDto[],
    articlesCount: number,
  ): ResArticeFeedDto {
    return { articles, articlesCount };
  }

  private buildArticleResponse(
    article: ArticleFullDataSerializedDto,
  ): ResArticleDto {
    return { article };
  }
}
