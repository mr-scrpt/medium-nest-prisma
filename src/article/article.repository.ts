import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IArticleQueryParamsRequered } from '@app/article/interface/query.interface';
import {
  authorBaseSelect,
  favoritedBaseSelect,
} from '@app/article/article.select';
import { Prisma } from '@prisma/client';
import { ArticleCreateDto } from './dto/articleCreate.dto';
import { ArticleUpdateDto } from './dto/articleUpdate.dto';
import { ArticleBuildEntity } from './entity/articleBuild.entity';
import { CommonService } from '@app/common/common.service';

@Injectable()
export class ArticleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
  ) {}

  async getArticleAllByParams(
    queryParams: IArticleQueryParamsRequered,
    // currentUserId: number,
  ): Promise<ArticleBuildEntity[]> {
    const params = this.prepareQueryParams(queryParams);
    const where = this.prepareWhereParams(queryParams);
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };

    console.log('where', where);

    const include = this.prepareIncludeParams(includeParams);
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
  ): Promise<ArticleBuildEntity[]> {
    const params = this.prepareQueryParams(queryParams);
    const followAuthorsIds = await this.getFollowAuthorsIds(currentUserId);
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };
    const where: Prisma.ArticleWhereInput = {
      authorId: {
        in: followAuthorsIds,
      },
    };

    const include = this.prepareIncludeParams(includeParams);
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

  async getArticleBySlug(slug: string): Promise<ArticleBuildEntity | null> {
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };

    const include = this.prepareIncludeParams(includeParams);
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },

      include,
    });

    if (!article) {
      return null;
    }

    const articleSerialize = this.common.exclude(article, ['authorId']);
    return articleSerialize;
  }

  async createArticle(
    articleCreateDto: ArticleCreateDto,
    slug: string,
    currentUserId: number,
  ): Promise<ArticleBuildEntity> {
    const data = {
      authorId: currentUserId,
      slug,
      ...articleCreateDto,
    };
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };
    const include = this.prepareIncludeParams(includeParams);

    const articleCreated = await this.prisma.article.create({
      data,
      include,
    });
    return articleCreated;
  }

  async deleteArticleBySlug(slug: string): Promise<void> {
    await this.prisma.article.delete({
      where: {
        slug,
      },
    });
  }

  async updateArticleBySlug(
    slug: string,
    articleUpdateDto: ArticleUpdateDto,
  ): Promise<ArticleBuildEntity> {
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };

    const data = {
      ...articleUpdateDto,
    };

    const include = this.prepareIncludeParams(includeParams);
    const articleUpdated = await this.prisma.article.update({
      where: {
        slug,
      },
      data,
      include,
    });
    return articleUpdated;
  }

  async addToFavoriteBySlug(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleBuildEntity> {
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };

    const currentArticle = await this.prisma.article.findUnique({
      where: {
        slug,
      },
    });

    const include = this.prepareIncludeParams(includeParams);
    const article = await this.prisma.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          connectOrCreate: [
            {
              where: {
                userId_articleId: {
                  userId: currentUserId,
                  articleId: currentArticle.id,
                },
              },
              create: {
                userId: currentUserId,
              },
            },
          ],
        },
      },
      include,
    });

    return article;
  }

  async deleteFromFavoriteBySlug(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleBuildEntity> {
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };

    const currentArticle = await this.prisma.article.findUnique({
      where: {
        slug,
      },
    });

    const include = this.prepareIncludeParams(includeParams);

    const article = await this.prisma.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          delete: {
            userId_articleId: {
              userId: currentUserId,
              articleId: currentArticle.id,
            },
          },
        },
      },
      include,
    });

    return article;
  }

  async changeFavoriteCount(direction: string, slug: string): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },
    });

    console.log(article);

    if (direction === 'up') {
      await this.prisma.article.update({
        where: {
          slug,
        },
        data: {
          favoritesCount: article.favoritesCount + 1,
        },
      });
    }
    if (direction === 'down' && article.favoritesCount > 0) {
      await this.prisma.article.update({
        where: {
          slug,
        },
        data: {
          favoritesCount: article.favoritesCount - 1,
        },
      });
    }
  }

  async countFeed(): Promise<number> {
    const count = await this.prisma.article.count();
    return count;
  }

  async checkArticleExist(slug: string): Promise<boolean> {
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },
    });
    return article ? true : false;
  }

  private prepareWhereParams(
    params: IArticleQueryParamsRequered,
  ): Prisma.ArticleWhereInput {
    const { tag, author, favorited } = params;
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
