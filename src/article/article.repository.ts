import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { include } from '@app/article/article.select';
import { Prisma } from '@prisma/client';
import { ArticleToDBDto } from '@app/article/dto/db/articleToDB.dto';
import { ArticleWithRelationEntity } from './entity/aticleWithRelation.entity';
import { ArticleEntity } from './entity/article.entity';
import { PayloadInclude } from './article.type';
import { IArticleQueryParamsRequered } from './article.interface';
import { Tx } from '@app/common/common.type';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(
    data: ArticleToDBDto,
    prisma: Tx = this.prisma,
  ): Promise<ArticleEntity> {
    return await prisma.article.create({ data });
  }

  async getArticleAllByParams(
    queryParams: IArticleQueryParamsRequered,
    prisma: Tx = this.prisma,
  ): Promise<ArticleWithRelationEntity[]> {
    const params = this.prepareQueryParams(queryParams);
    const where = this.prepareWhereParams(queryParams);

    const articles = await prisma.article.findMany({
      ...params,
      where,
      include,
    });

    return articles;
  }

  async getArticleFollowByParams(
    queryParams: IArticleQueryParamsRequered,
    currentUserId: number,
    prisma: Tx = this.prisma,
  ): Promise<ArticleWithRelationEntity[]> {
    const params = this.prepareQueryParams(queryParams);
    const followAuthorsIds = await this.getFollowAuthorsIds(currentUserId);
    const where: Prisma.ArticleWhereInput = {
      authorId: {
        in: followAuthorsIds,
      },
    };

    const articles = await prisma.article.findMany({
      ...params,
      where,
      include,
    });

    return articles;
  }

  async getFollowAuthorsIds(
    currentUserId: number,
    prisma: Tx = this.prisma,
  ): Promise<number[]> {
    const followAuthors = await prisma.userToUser.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followAuthorsIds = followAuthors.map((item) => item.followingId);
    return followAuthorsIds;
  }

  async getArticleBySlug(
    slug: string,
    prisma: Tx = this.prisma,
  ): Promise<ArticleWithRelationEntity> {
    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
      include,
    });

    if (!article) {
      return null;
    }
    return article;
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
    prisma: Tx = this.prisma,
  ): Promise<ArticleWithRelationEntity> {
    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
      include: {
        favoritedBy: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!article) {
      return null;
    }

    const isFavorite = article.favoritedBy.some(
      (favorite) => favorite.userId === currentUserId,
    );

    if (isFavorite) {
      return null;
    }

    const articleUpdated = await prisma.article.update({
      where: {
        slug,
      },
      data: {
        favoritedBy: {
          create: {
            userId: currentUserId,
          },
        },
        favoritesCount: {
          increment: 1,
        },
      },
      include,
    });

    return articleUpdated;
  }

  async removeArticleFromFavorites(
    slug: string,
    currentUserId: number,
    prisma: Tx = this.prisma,
  ): Promise<ArticleWithRelationEntity> {
    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
      include: {
        favoritedBy: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!article) {
      return null;
    }

    const isFavorite = article.favoritedBy.some(
      (favorite) => favorite.userId === currentUserId,
    );

    if (!isFavorite) {
      return null;
    }

    const articleUpdated = await prisma.article.update({
      where: {
        slug,
      },
      data: {
        favoritedBy: {
          delete: {
            userId_articleId: {
              userId: currentUserId,
              articleId: article.id,
            },
          },
        },
        favoritesCount: {
          decrement: 1,
        },
      },
      include,
    });

    return articleUpdated;
  }

  async updateArticle(
    articleToDBDto: ArticleToDBDto,
    slug: string,
    prisma: Tx = this.prisma,
  ): Promise<PayloadInclude> {
    const articleUpdated: PayloadInclude = await prisma.article.update({
      where: {
        slug: slug,
      },
      data: {
        ...articleToDBDto,
      },
      include,
    });

    return articleUpdated;
  }

  async deleteArticleBySlug(
    slug: string,
    driver: Tx = this.prisma,
  ): Promise<void> {
    await driver.article.delete({
      where: {
        slug,
      },
    });
  }

  async countFeed(queryParams: IArticleQueryParamsRequered): Promise<number> {
    const where = this.prepareWhereParams(queryParams);
    const count = await this.prisma.article.count({ where });
    return count;
  }

  async countFollow(currentUserId: number): Promise<number> {
    const followAuthorsIds = await this.getFollowAuthorsIds(currentUserId);
    const where: Prisma.ArticleWhereInput = {
      authorId: {
        in: followAuthorsIds,
      },
    };

    return await this.prisma.article.count({
      where,
    });
  }

  private prepareWhereParams(params: any): Prisma.ArticleWhereInput {
    const { tag, author, favorited } = params;
    const where = {
      AND: [],
    };

    if (tag) {
      where.AND.push({
        tagList: {
          some: {
            tag: {
              name: tag,
            },
          },
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
    if (favorited) {
      where.AND.push({
        favoritedBy: {
          some: {
            user: {
              username: favorited,
            },
          },
        },
      });
    }

    return where;
  }

  private prepareQueryParams(parms: any): Prisma.ArticleFindManyArgs {
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
