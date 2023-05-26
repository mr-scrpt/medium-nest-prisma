// article.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IArticleQueryParamsRequered } from '@app/article/interface/query.interface';
import {
  authorBaseSelect,
  favoritedBaseSelect,
} from '@app/article/article.select';
import { IArticleWithAuthorAndFavoritedBy } from './interface/db.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getArticleAllByParams(
    queryParams: IArticleQueryParamsRequered,
    currentUserId: number,
  ): Promise<IArticleWithAuthorAndFavoritedBy[]> {
    const params = this.prepareQueryParams(queryParams);
    const where = this.prepareWhereParams(queryParams, currentUserId);
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };

    const include = this.prepareIncludeParams(includeParams);
    const articles = await this.prisma.article.findMany({
      ...params,
      where,
      include,
    });

    return articles as IArticleWithAuthorAndFavoritedBy[];
  }

  async countFeed(): Promise<number> {
    const count = await this.prisma.article.count();
    return count;
  }

  private prepareWhereParams(
    params: IArticleQueryParamsRequered,
    currentUserId: number,
  ): Prisma.ArticleWhereInput {
    const { tag, author, favorited } = params;
    const favBool = favorited === 'true' ? true : false;
    const where = {
      AND: [],
    };
    if (tag) {
      where.AND.push({
        tagList: {
          hasSome: tag,
        },
      });
    }
    if (author) {
      where.AND.push({
        author: {
          username: {
            equals: author,
          },
        },
      });
    }
    if (favBool) {
      where.AND.push({
        favoritedBy: {
          some: {
            userId: currentUserId,
          },
        },
      });
    }
    return where;
  }

  private prepareQueryParams(
    parms: IArticleQueryParamsRequered,
  ): Prisma.ArticleFindManyArgs {
    const { offset, limit, orderBy, direction } = parms;
    return {
      take: limit,
      skip: offset,
      orderBy: {
        [orderBy]: direction,
      },
    };
  }

  private prepareIncludeParams(
    includeParams: Record<string, any>,
  ): Prisma.ArticleInclude {
    const include: Prisma.ArticleInclude = {};

    for (const key in includeParams) {
      if (Object.prototype.hasOwnProperty.call(includeParams, key)) {
        include[key] = {
          select: includeParams[key],
        };
      }
    }

    return include;
  }
}
