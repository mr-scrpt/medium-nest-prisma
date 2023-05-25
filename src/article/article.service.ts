import { Injectable } from '@nestjs/common';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { ArticleClearDto } from '@app/article/dto/articleClear.dto';
import { CommonService } from '@app/common/common.service';
import { UserService } from '@app/user/user.service';
import { IArticleQueryParamsRequered } from './interface/query.interface';
import { Token } from '@app/auth/iterface/auth.interface';
import { ArticleRepository } from './article.repository';
import { IArticleWithAuthorAndFavoritedBy } from './interface/db.interface';
import { ArticleFeedBuildResponseDto } from './dto/articleFeedBuildResponse.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly common: CommonService,
    private readonly user: UserService,
    private readonly articleRepository: ArticleRepository,
  ) {}

  async getFeedByParamsAndToken(
    queryParams: IArticleQueryParamsRequered,
    token: Token,
  ): Promise<ArticleFeedBuildResponseDto> {
    const currentUserId = await this.getCurrentUserId(token);
    const params = this.prepareQueryParams(queryParams);
    const where = this.prepareWhereParams(queryParams, currentUserId);

    const [articles, articleCount] = await Promise.all([
      await this.articleRepository.getArticleFeed(params, where),
      await this.getCountAllArticle(),
    ]);

    const data = await this.getArticleWithFavoritesData(
      articles,
      currentUserId,
    );

    const buildData = this.buildArticlesFeedResponse(data, articleCount);
    return buildData;
  }

  private async getCountAllArticle(): Promise<number> {
    return await this.articleRepository.countFeed();
  }

  private prepareQueryParams(queryParams: IArticleQueryParamsRequered) {
    return this.articleRepository.prepareQueryParams(queryParams);
  }

  private prepareWhereParams(
    queryParams: IArticleQueryParamsRequered,
    currentUserId: number,
  ) {
    return this.articleRepository.prepareWhereParams(
      queryParams,
      currentUserId,
    );
  }

  private async getCurrentUserId(token: Token): Promise<number> {
    const { id } = await this.user.getUserByToken(token);
    return id;
  }

  private async getArticleWithFavoritesData(
    articles: IArticleWithAuthorAndFavoritedBy[],
    currentUserId: number,
  ): Promise<ArticleClearDto[]> {
    return articles.map((article) => {
      const favorited = article.favoritedBy.some((user) => {
        return user.id === currentUserId;
      });
      delete article.favoritedBy;
      return {
        ...article,
        favorited,
      };
    });
  }

  private buildArticleResponse(
    article: ArticleClearDto,
  ): ArticleBuildResponseDto {
    return { article };
  }

  private buildArticlesFeedResponse(
    articles: ArticleClearDto[],
    count: number,
  ): any {
    return { articles, count };
  }
}
