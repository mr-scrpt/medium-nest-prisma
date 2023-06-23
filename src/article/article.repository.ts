import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { include } from '@app/article/article.select';
import { Prisma } from '@prisma/client';
import { CommonService } from '@app/common/common.service';
import { ArticleToDBDto } from '@app/article/dto/db/articleToDB.dto';
import { ArticleWithRelationEntity } from './entity/aticleWithRelation.entity';
import { ArticleEntity } from './entity/article.entity';
import { PayloadInclude } from './article.type';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { IArticleQueryParamsRequered } from './article.interface';
import { ArticleToTagRepository } from '@app/articleToTag/articleToTag.repository';
import { Tx } from '@app/common/common.type';
import { TagRepository } from '@app/tag/tag.repository';

@Injectable()
export class ArticleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
    private readonly tagRepository: TagRepository,
    private readonly articleToTagRepository: ArticleToTagRepository,
  ) {}

  async createArticle(
    data: ArticleToDBDto,
    driver: Tx = this.prisma,
  ): Promise<ArticleEntity> {
    return await driver.article.create({ data });
  }

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

  async getArticleBySlug(
    slug: string,
    driver: Tx = this.prisma,
  ): Promise<ArticleWithRelationEntity> {
    const article = await driver.article.findUnique({
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

  // async tagCreateAndPrepareList(
  //   tagName: string[],
  //   tx: Tx,
  // ): Promise<TagEntity[]> {
  //   const tagPromises = tagName.map(async (tag) => {
  //     if (tag === '') {
  //       return null; // Пропускаем пустую строку
  //     }
  //     const existingTag = await tx.tag.findUnique({
  //       where: { name: tag },
  //     });

  //     if (existingTag) {
  //       return existingTag; // Используем уже существующий тег
  //     } else {
  //       // Создание нового тега
  //       const createdTag = await tx.tag.create({ data: { name: tag } });
  //       return createdTag;
  //     }
  //   });
  //   return await Promise.all(tagPromises);
  // }

  async createArticleTransaction(
    articleToDBDto: ArticleToDBDto,
    tagName: string[],
  ): Promise<ArticleEntity> {
    // const articleCreated = await this.prisma.$transaction(async (tx) => {
    //   const tagList = await this.tagCreateAndPrepareList(tagName, tx);

    //   const article = await tx.article.create({
    //     data: {
    //       authorId: articleToDBDto.authorId,
    //       slug: articleToDBDto.slug,
    //       title: articleToDBDto.title,
    //       description: articleToDBDto.description,
    //       body: articleToDBDto.body,
    //     },
    //   });

    //   await tx.articleToTag.createMany({
    //     data: tagList.map((tag) => ({
    //       articleId: article.id,
    //       tagId: tag.id,
    //     })),
    //   });

    //   return article;
    // });

    // return articleCreated;
    //
    return null;
  }

  async updateArticle(
    articleToDBDto: ArticleToDBDto,
    slug: string,
    driver: Tx = this.prisma,
  ): Promise<PayloadInclude> {
    const articleUpdated: PayloadInclude = await driver.article.update({
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

  // async deleteNotExistArticleToTag(
  //   articleId: number,
  //   existingTagIds: number[],
  //   driver: Tx = this.prisma,
  // ): Promise<void> {
  //   await driver.articleToTag.deleteMany({
  //     where: {
  //       articleId: articleId,
  //       tagId: {
  //         notIn: existingTagIds,
  //       },
  //     },
  //   });
  // }

  // async createNewArticleToTag(
  //   articleId: number,
  //   newTags: TagEntity[],
  //   driver: Tx = this.prisma,
  // ): Promise<void> {
  //   await driver.articleToTag.createMany({
  //     data: newTags.map((tag) => ({
  //       articleId: articleId,
  //       tagId: tag.id,
  //     })),
  //   });
  // }

  async deleteUnuseTags(driver: Tx = this.prisma): Promise<void> {
    const unusedTags = await this.getUnusedTagList(driver);
    await driver.tag.deleteMany({
      where: {
        id: {
          in: unusedTags.map((tag) => tag.id),
        },
      },
    });
  }

  // async updateArticleTransaction(
  //   articleToDBDto: ArticleToDBDto,
  //   tagName: string[],
  //   slug: string,
  // ): Promise<ArticleEntity> {
  //   const articleUpdated = await this.prisma.$transaction(async (tx) => {
  //     const tagList = await this.tagCreateAndPrepareList(tagName, tx);

  //     const article = await this.updateArticle(articleToDBDto, slug, tx);

  //     const existingTagIds = article.tagList.map((tag) => tag.id); // Получаем текущие id тегов статьи

  //     await this.deleteNotExistArticleToTag(article.id, existingTagIds, tx);

  //     // Находим новые теги, которые не присутствуют в текущем списке тегов
  //     const newTags = tagList.filter((tag) => !existingTagIds.includes(tag.id));

  //     // // Создаем новые связи articleToTag только для новых тегов
  //     await this.createNewArticleToTag(article.id, newTags, tx);

  //     // Удаляем теги, которые не используются больше в каких-либо статьях
  //     await this.deleteUnuseTags(tx);

  //     return article;
  //   });

  //   return articleUpdated;
  // }
  //
  //
  // async performTransaction<T>(callback: (tx: Tx) => Promise<T>): Promise<T> {
  //   const result = await this.prisma.$transaction(async (transaction) => {
  //     return await callback(transaction);
  //   });

  //   return result;
  // }

  // async updateArticleTransaction(
  //   articleToDBDto: ArticleToDBDto,
  //   tagName: string[],
  //   slug: string,
  // ): Promise<ArticleEntity> {
  //   const action = async (tx: Tx) => {
  //     const tagList = await this.tagCreateAndPrepareList(tagName, tx);

  //     const article = await this.updateArticle(articleToDBDto, slug, tx);

  //     const existingTagIds = article.tagList.map((tag) => tag.id); // Получаем текущие id тегов статьи

  //     await this.deleteNotExistArticleToTag(article.id, existingTagIds, tx);

  //     // Находим новые теги, которые не присутствуют в текущем списке тегов
  //     const newTags = tagList.filter((tag) => !existingTagIds.includes(tag.id));

  //     // // Создаем новые связи articleToTag только для новых тегов
  //     await this.createNewArticleToTag(article.id, newTags, tx);

  //     // Удаляем теги, которые не используются больше в каких-либо статьях
  //     await this.deleteUnuseTags(tx);

  //     return article;
  //   };
  //   const article = await this.performTransaction<ArticleEntity>(action);

  //   return article;

  //   // return articleUpdated;
  // }

  // async deleteArticleBySlugTransaction(slug: string): Promise<void> {
  //   await this.prisma.$transaction(async (tx) => {
  //     const article = await this.findArticleBySlug(slug, tx);
  //     const existingTagIds = article.tagList.map((tag) => tag.id); // Получаем текущие id тегов статьи

  //     await this.deleteNotExistArticleToTag(article.id, existingTagIds, tx);

  //     await this.deleteArticleBySlug(slug, tx);

  //     await this.deleteArticleToTag(article.id, tx);

  //     await this.deleteUnuseTags(tx);
  //   });
  // }

  private async findArticleBySlug(
    slug: string,
    driver: Tx = this.prisma,
  ): Promise<PayloadInclude> {
    const article: PayloadInclude = await driver.article.findUnique({
      where: {
        slug,
      },
      include,
    });

    return article;
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

  // Обвертки
  private async deleteArticleToTag(
    articleId: number,
    driver: Tx = this.prisma,
  ): Promise<void> {
    await this.articleToTagRepository.deleteByArticleId(articleId, driver);
  }

  private async getUnusedTagList(
    driver: Tx = this.prisma,
  ): Promise<TagEntity[]> {
    // return await driver.tag.findMany({
    //   where: {
    //     articles: {
    //       none: {}, // Ни одна статья не связана с тегом
    //     },
    //   },
    // });
    return await this.tagRepository.getUnusedTagList(driver);
  }
}
