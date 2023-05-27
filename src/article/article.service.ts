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
// import { ArticleDBDto } from './dto/articleCreateDB.dto';
import { ArticleUpdateDto } from './dto/articleUpdate.dto';
import { ArticleBuildEntity } from './entity/articleBuild.entity';

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
    const currentUserId = this.user.getUserIdFromToken(token);

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
    const currentUserId = this.user.getUserIdFromToken(token);
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
    console.log('in create article');
    const slug = this.common.slugGenerator(articleCreateDto.title);

    const articleExist = await this.articleRepository.getArticleBySlug(slug);

    if (articleExist && articleExist.slug === slug) {
      throw new HttpException(
        'Article with this title already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentUserId = this.user.getUserIdFromToken(token);

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
    const currentUserId = this.user.getUserIdFromToken(token);
    const article = await this.articleRepository.getArticleBySlug(slug);

    if (article?.author?.id !== currentUserId) {
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

    try {
      await this.articleRepository.deleteArticleBySlug(slug);
    } catch (error) {
      throw new HttpException(
        'Article not deleted',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateArticleBySlugAndToken(
    slug: string,
    articleUpdateDto: ArticleUpdateDto,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const currentUserId = this.user.getUserIdFromToken(token);
    const slugNew = this.common.slugGenerator(articleUpdateDto.title);
    const articleExist = await this.articleRepository.getArticleBySlug(slug);

    if (!articleExist) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (articleExist.slug === slugNew) {
      throw new HttpException(
        'Article with this title already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (articleExist.author.id !== currentUserId) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const articleUpdate = await this.articleRepository.updateArticleBySlug(
        slug,
        slugNew,
        articleUpdateDto,
      );
      const data = this.getArticleWithFavoritesData(
        articleUpdate,
        currentUserId,
      );
      const buildData = this.buildArticleResponse(data);
      return buildData;
    } catch (error) {
      throw new HttpException(
        'Article not updated',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addToFavoritesBySlugAndToken(
    slug: string,
    token: Token,
  ): Promise<ArticleBuildResponseDto> {
    const currentUserId = this.user.getUserIdFromToken(token);

    const articleExist = await this.articleRepository.getArticleBySlug(slug);
    if (!articleExist) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.NOT_FOUND,
      );
    }

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

    const articleExist = await this.articleRepository.getArticleBySlug(slug);

    if (!articleExist) {
      throw new HttpException(
        'Article with this slug not found',
        HttpStatus.NOT_FOUND,
      );
    }

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
  ): Promise<ArticleClearDto[]> {
    return articles.map((article) => {
      return this.getArticleWithFavoritesData(article, currentUserId);
    });
  }
  private getArticleWithFavoritesData(
    article: ArticleBuildEntity,
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
