// article.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IArticleQueryParamsRequered } from '@app/article/interface/query.interface';
import { authorBaseSelect } from '@app/article/article.select';
import { IArticleWithAuthorAndFavoritedBy } from './interface/db.interface';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getArticleFeed(
    params: any,
    where: any,
  ): Promise<IArticleWithAuthorAndFavoritedBy[]> {
    const articles = await this.prisma.article.findMany({
      ...params,
      where,
      include: {
        author: {
          select: authorBaseSelect,
        },
        favoritedBy: { select: { id: true } },
      },
    });

    return articles as IArticleWithAuthorAndFavoritedBy[];
  }

  async countFeed(): Promise<number> {
    const count = await this.prisma.article.count();
    return count;
  }

  prepareWhereParams(
    params: IArticleQueryParamsRequered,
    currentUserId: number,
  ) {
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

  prepareQueryParams(parms: IArticleQueryParamsRequered) {
    const { offset, limit, orderBy, direction } = parms;
    return {
      take: limit,
      skip: offset,
      orderBy: {
        [orderBy]: direction,
      },
    };
  }
}
