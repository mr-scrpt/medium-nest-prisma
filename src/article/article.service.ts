import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { CommonService } from '@app/common/common.service';
import { UserService } from '@app/user/user.service';
import { IArticleQueryParamsRequered } from './interface/query.interface';
import { Token } from '@app/auth/iterface/auth.interface';
import { ArticleRepository } from './article.repository';
import { ArticleBuildResponseFeedDto } from './dto/articleBuildResponseFeed.dto';
import { ArticleCreateDto } from './dto/articleCreate.dto';
import { ArticleUpdateDto } from './dto/articleUpdate.dto';
import { ArticleBuildEntity } from './entity/articleBuild.entity';
import { ArticleResponseDto } from './dto/articleResponse.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly common: CommonService,
    private readonly user: UserService,
    private readonly articleRepository: ArticleRepository,
  ) {}

  async getArticleAllByParamsAndToken(
    queryParams: IArticleQueryParamsRequered,
    token: Token,
  ): Promise<ArticleBuildResponseFeedDto> {
    const currentUserId = this.user.getUserIdFromToken(token);

    const [articles, articleCount] = await this.getArticleFeedWithCount(
      queryParams,
      currentUserId,
    );

    const data = await this.getArticlesFeedWithFavoritesData(
      articles,
      currentUserId,
    );

    const buildData = this.buildArticlesFeedResponse(data, articleCount);
    return buildData;
  }

  async getArticleBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const currentUserId = this.user.getUserIdFromToken(token);
    const article = await this.checkAndGetArticleBySlug(slug);

    const data = this.getArticleWithFavoritesData(article, currentUserId);
    const buildData = this.buildArticleResponse(data);
    return buildData;
  }

  async createArticle(
    articleCreateDto: ArticleCreateDto,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const slug = this.common.slugGenerator(articleCreateDto.title);

    await this.checkUniqueArticleBySlug(slug);

    const currentUserId = this.user.getUserIdFromToken(token);

    const articleCreated = await this.createAndCheckArticle(
      articleCreateDto,
      slug,
      currentUserId,
    );

    const data = this.getArticleWithFavoritesData(
      articleCreated,
      currentUserId,
    );
    const buildData = this.buildArticleResponse(data);
    return buildData;
  }

  async deleteArticleBySlugAndToken(slug: string, token: Token): Promise<void> {
    const currentUserId = this.user.getUserIdFromToken(token);
    const article = await this.checkAndGetArticleBySlug(slug);

    this.checkArticleAuthor(article, currentUserId);

    await this.deleteArticleBySlug(slug);
  }

  async updateArticleBySlugAndToken(
    slug: string,
    articleUpdateDto: ArticleUpdateDto,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const currentUserId = this.user.getUserIdFromToken(token);
    const article = await this.checkAndGetArticleBySlug(slug);

    const slugNew = this.checkAndGenerateSlug(slug, articleUpdateDto.title);
    await this.checkUniqueSlug(slugNew);

    this.checkArticleAuthor(article, currentUserId);

    const dataUpdate = {
      ...articleUpdateDto,
      slug: slugNew,
    };

    const articleUpdated = await this.updateArticleBySlug(slug, dataUpdate);

    const data = this.getArticleWithFavoritesData(
      articleUpdated,
      currentUserId,
    );
    return this.buildArticleResponse(data);
  }

  async addToFavoritesBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const currentUserId = this.user.getUserIdFromToken(token);
    await this.checkAndGetArticleBySlug(slug);

    const isFavorite = await this.isFavorited(slug, currentUserId);
    console.log(isFavorite);

    this.checkArticleInFavorites(isFavorite);

    const articleWithFavorites =
      await this.articleRepository.addToFavoriteBySlug(slug, currentUserId);

    const data = this.getArticleWithFavoritesData(
      articleWithFavorites,
      currentUserId,
    );
    const buildData = this.buildArticleResponse(data);
    return buildData;
  }

  async deleteFromFavoritesBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const currentUserId = this.user.getUserIdFromToken(token);

    await this.checkAndGetArticleBySlug(slug);

    const isFavorite = await this.isFavorited(slug, currentUserId);
    console.log(isFavorite);

    this.checkArticleIsNotInFavorites(isFavorite);

    const articleWithFavorites =
      await this.articleRepository.deleteFromFavoriteBySlug(
        slug,
        currentUserId,
      );

    const data = this.getArticleWithFavoritesData(
      articleWithFavorites,
      currentUserId,
    );

    const buildData = this.buildArticleResponse(data);
    return buildData;
  }

  private async getArticlesFeedWithFavoritesData(
    articles: ArticleBuildEntity[],
    currentUserId: number | null,
  ): Promise<ArticleResponseDto[]> {
    return articles.map((article) => {
      return this.getArticleWithFavoritesData(article, currentUserId);
    });
  }

  private getArticleWithFavoritesData(
    article: ArticleBuildEntity,
    currentUserId: number | null,
  ): ArticleResponseDto {
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
    currentUserId: number,
  ): Promise<[ArticleBuildEntity[], number]> {
    return await Promise.all([
      await this.articleRepository.getArticleAllByParams(
        queryParams,
        currentUserId,
      ),
      await this.articleRepository.countFeed(),
    ]);
  }

  private async checkAndGetArticleBySlug(
    slug: string,
  ): Promise<ArticleBuildEntity> {
    const article = await this.articleRepository.getArticleBySlug(slug);

    if (!article) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return article;
  }

  private checkAndGenerateSlug(slug: string, title: string): string {
    if (!title) {
      return;
    }
    const slugNew = this.common.slugGenerator(title);
    if (title && slug == slugNew) {
      throw new HttpException(
        'Article with this slug already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return slugNew;
  }

  private async checkUniqueArticleBySlug(
    slug: string,
  ): Promise<ArticleBuildEntity> {
    const article = await this.articleRepository.getArticleBySlug(slug);

    if (article) {
      throw new HttpException(
        'Article with this slug already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return article;
  }

  private async checkUniqueSlug(slugNew: string): Promise<void> {
    console.log('in checkUniqueSlug', slugNew);

    if (!slugNew) {
      console.log('slugNew is empty');
      return;
    }

    const articleExist = await this.checkUniqueArticleBySlug(slugNew);

    if (articleExist) {
      throw new HttpException(
        'Article with this slug already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkArticleAuthor(
    article: ArticleBuildEntity,
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

  private async updateArticleBySlug(
    slug: string,
    articleUpdateDto: ArticleUpdateDto,
  ) {
    try {
      return await this.articleRepository.updateArticleBySlug(
        slug,
        articleUpdateDto,
      );
    } catch (error) {
      throw new HttpException(
        'Article not updated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async createAndCheckArticle(
    articleCreateDto: ArticleCreateDto,
    slug: string,
    currentUserId: number,
  ): Promise<ArticleBuildEntity> {
    const article = await this.articleRepository.createArticle(
      articleCreateDto,
      slug,
      currentUserId,
    );

    if (!article) {
      throw new HttpException('Article not created', HttpStatus.BAD_REQUEST);
    }
    return article;
  }

  private async isFavorited(
    slug: string,
    currentUserId: number,
  ): Promise<boolean> {
    const article = await this.checkAndGetArticleBySlug(slug);
    console.log('Article in isFavorited', article);
    const isInFavorites = article.favoritedBy.some((user) => {
      console.log('Current user id', currentUserId);
      console.log('User id in article', user.userId);
      if (user.userId === currentUserId) {
        return true;
      }
    });

    if (isInFavorites) {
      return true;
    }

    return false;
  }

  private checkArticleInFavorites(isFavorite: boolean): void {
    if (isFavorite) {
      throw new HttpException(
        'This article is already in favorites',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkArticleIsNotInFavorites(isFavorite: boolean): void {
    if (!isFavorite) {
      throw new HttpException(
        'You can not delete from favorites your article',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private buildArticleResponse(
    article: ArticleResponseDto,
  ): ArticleBuildResponseDto {
    return { article };
  }

  private buildArticlesFeedResponse(
    articles: ArticleResponseDto[],
    articlesCount: number,
  ): ArticleBuildResponseFeedDto {
    return { articles, articlesCount };
  }
}
