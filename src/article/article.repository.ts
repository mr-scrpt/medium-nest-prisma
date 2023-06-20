import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { include } from '@app/article/article.select';
import { Prisma, Tag } from '@prisma/client';
import { CommonService } from '@app/common/common.service';
import { TagService } from '@app/tag/tag.service';
import { ArticleToDBDto } from '@app/article/dto/db/articleToDB.dto';
import { ArticleWithRelationEntity } from './entity/aticleWithRelation.entity';
import { ArticleEntity } from './entity/article.entity';
import { Tx } from './article.type';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { IArticleQueryParamsRequered } from './article.interface';

@Injectable()
export class ArticleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
    private readonly tag: TagService,
  ) {}

  async getArticleAllByParams(
    queryParams: IArticleQueryParamsRequered,
  ): Promise<ArticleWithRelationEntity[]> {
    const params = this.prepareQueryParams(queryParams);
    const where = this.prepareWhereParams(queryParams);

    const articles = await this.prisma.article.findMany({
      ...params,
      where,
      include,
    });

    return articles;
  }

  async getArticleFollowByParams(
    queryParams: IArticleQueryParamsRequered,
    currentUserId: number,
  ): Promise<ArticleWithRelationEntity[]> {
    const params = this.prepareQueryParams(queryParams);
    const followAuthorsIds = await this.getFollowAuthorsIds(currentUserId);
    const where: Prisma.ArticleWhereInput = {
      authorId: {
        in: followAuthorsIds,
      },
    };

    const articles = await this.prisma.article.findMany({
      ...params,
      where,
      include,
    });

    return articles;
  }

  async getFollowAuthorsIds(currentUserId: number): Promise<number[]> {
    const followAuthors = await this.prisma.userToUser.findMany({
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

  async getArticleBySlug(slug: string): Promise<ArticleWithRelationEntity> {
    const article = await this.prisma.article.findUnique({
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
  ): Promise<ArticleWithRelationEntity> {
    const articleToFavorite = await this.prisma.$transaction(async (tx: Tx) => {
      const article = await tx.article.findUnique({
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

      const articleUpdated = await tx.article.update({
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
    });

    return articleToFavorite;
  }

  async removeArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleWithRelationEntity> {
    const articleToRemove = await this.prisma.$transaction(async (tx: Tx) => {
      const article = await tx.article.findUnique({
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

      const articleUpdated = await tx.article.update({
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
    });

    return articleToRemove;
  }

  async tagCreateAndPrepareList(
    tx: Tx,
    tagName: string[],
  ): Promise<TagEntity[]> {
    const tagPromises = tagName.map(async (tag) => {
      if (tag === '') {
        return null; // Пропускаем пустую строку
      }
      const existingTag = await tx.tag.findUnique({
        where: { name: tag },
      });

      if (existingTag) {
        return existingTag; // Используем уже существующий тег
      } else {
        // Создание нового тега
        const createdTag = await tx.tag.create({ data: { name: tag } });
        return createdTag;
      }
    });
    return await Promise.all(tagPromises);
  }

  async createArticleTransaction(
    articleToDBDto: ArticleToDBDto,
    tagName: string[],
  ): Promise<ArticleEntity> {
    const articleCreated = await this.prisma.$transaction(async (tx) => {
      const tagList = await this.tagCreateAndPrepareList(tx, tagName);

      const article = await tx.article.create({
        data: {
          authorId: articleToDBDto.authorId,
          slug: articleToDBDto.slug,
          title: articleToDBDto.title,
          description: articleToDBDto.description,
          body: articleToDBDto.body,
        },
      });

      await tx.articleToTag.createMany({
        data: tagList.map((tag) => ({
          articleId: article.id,
          tagId: tag.id,
        })),
      });

      return article;
    });

    return articleCreated;
  }

  async updateArticleTransaction(
    articleToDBDto: ArticleToDBDto,
    tagName: string[],
    slug: string,
  ): Promise<ArticleEntity> {
    const articleUpdated = await this.prisma.$transaction(async (tx) => {
      const tagList = await this.tagCreateAndPrepareList(tx, tagName);

      const article = await tx.article.update({
        where: {
          slug: slug,
        },
        data: {
          ...articleToDBDto,
        },
      });

      await tx.articleToTag.deleteMany({
        where: {
          articleId: article.id,
        },
      });

      await tx.articleToTag.createMany({
        data: tagList.map((tag) => ({
          articleId: article.id,
          tagId: tag.id,
        })),
      });

      return article;
    });

    return articleUpdated;
  }

  async deleteArticleBySlug(slug: string): Promise<void> {
    await this.prisma.article.delete({
      where: {
        slug,
      },
    });
  }

  async countFeed(queryParams: IArticleQueryParamsRequered): Promise<number> {
    // const params = this.prepareQueryParams(queryParams);
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

  // async getArticles() {
  //   const articlesWithTag = await this.prisma.article.findMany({
  //     where: {
  //       tagList: {
  //         some: {
  //           tag: {
  //             name: 'foo',
  //           },
  //         },
  //       },
  //     },
  //     include: {
  //       tagList: {
  //         include: {
  //           tag: true,
  //         },
  //       },
  //     },
  //   });

  //   // console.log(articlesWithTag);
  //   articlesWithTag.map((article) => {
  //     console.dir({ article });
  //     article.tagList.map((tag) => {
  //       console.dir({ tag });
  //     });
  //   });
  // }
}
