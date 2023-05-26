import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { ArticleClearDto } from '@app/article/dto/articleClear.dto';
import { CommonService } from '@app/common/common.service';
import { UserService } from '@app/user/user.service';
import { IArticleQueryParamsRequered } from './interface/query.interface';
import { Token } from '@app/auth/iterface/auth.interface';
import { ArticleRepository } from './article.repository';
import { ArticleFeedBuildResponseDto } from './dto/articleFeedBuildResponse.dto';
import { ArticleCreateDto } from './dto/articleCreate.dto';
import { ArticleDBDto } from './dto/articleCreateDB.dto';

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
  ): Promise<ArticleFeedBuildResponseDto> {
    const currentUserId = await this.getCurrentUserId(token);

    const [articles, articleCount] = await Promise.all([
      await this.articleRepository.getArticleAllByParams(
        queryParams,
        currentUserId,
      ),
      await this.articleRepository.countFeed(),
    ]);

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
    const currentUserId = await this.getCurrentUserId(token);
    const article = await this.articleRepository.getArticleBySlug(slug);

    if (!article) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const data = this.getArticleWithFavoritesData(article, currentUserId);
    const buildData = this.buildArticleResponse(data);
    return buildData as ArticleBuildResponseDto;
  }

  async createArticle(
    articleCreateDto: ArticleCreateDto,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const slug = this.common.slugGenerator(articleCreateDto.title);

    const articleExist = await this.articleRepository.checkArticleExist(slug);
    if (articleExist) {
      throw new HttpException(
        'Article with this title already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentUserId = await this.getCurrentUserId(token);
    const article = await this.articleRepository.createArticle(
      articleCreateDto,
      slug,
      currentUserId,
    );

    if (!article) {
      throw new HttpException(
        'Article not created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const data = this.getArticleWithFavoritesData(article, currentUserId);
    const buildData = this.buildArticleResponse(data);
    return buildData;
  }

  async deleteArticleBySlugAndToken(slug: string, token: Token): Promise<void> {
    const currentUserId = await this.getCurrentUserId(token);
    console.log('currentUserId', currentUserId);
    const article = await this.articleRepository.getArticleBySlug(slug);

    console.log(article.author.id, currentUserId);
    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!article) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.articleRepository.deleteArticleBySlug(slug);
  }

  // private async getCountAllArticle(): Promise<number> {
  //   return await this.articleRepository.countFeed();
  // }

  // private prepareQueryParams(queryParams: IArticleQueryParamsRequered) {
  //   return this.articleRepository.prepareQueryParams(queryParams);
  // }

  // private prepareWhereParams(
  //   queryParams: IArticleQueryParamsRequered,
  //   currentUserId: number,
  // ) {
  //   return this.articleRepository.prepareWhereParams(
  //     queryParams,
  //     currentUserId,
  //   );
  // }

  // private async getCurrentUserId(token: Token): Promise<number> {
  //   const { id } = await this.user.getUserByToken(token);
  //   return id;
  // }

  private async getCurrentUserId(token: Token): Promise<number | null> {
    try {
      const { id } = await this.user.getUserByToken(token);
      console.log('id', id);
      return id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private async getArticlesFeedWithFavoritesData(
    articles: ArticleDBDto[],
    currentUserId: number | null,
  ): Promise<ArticleClearDto[]> {
    return articles.map((article) => {
      return this.getArticleWithFavoritesData(article, currentUserId);
    });
  }
  private getArticleWithFavoritesData(
    article: ArticleDBDto,
    currentUserId: number | null,
  ): ArticleClearDto {
    const favorited = article.favoritedBy.some((user) => {
      return user.id === currentUserId;
    });
    delete article.favoritedBy;
    return {
      ...article,
      favorited,
    };
  }

  private buildArticleResponse(
    article: ArticleClearDto,
  ): ArticleBuildResponseDto {
    return { article };
  }

  private buildArticlesFeedResponse(
    articles: ArticleClearDto[],
    articlesCount: number,
  ): ArticleFeedBuildResponseDto {
    return { articles, articlesCount };
  }
}
