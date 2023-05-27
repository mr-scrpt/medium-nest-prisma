// article.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IArticleQueryParamsRequered } from '@app/article/interface/query.interface';
import {
  authorBaseSelect,
  favoritedBaseSelect,
} from '@app/article/article.select';
import { IArticleDBDto } from './interface/db.interface';
import { Article, Prisma } from '@prisma/client';
import { ArticleCreateDto } from './dto/articleCreate.dto';
import { ArticleDBDto } from './dto/articleCreateDB.dto';
import { ArticleUpdateDto } from './dto/articleUpdate.dto';
import { ArticleBuildEntity } from './entity/articleBuild.entity';
import { exclude } from './article.helper';

@Injectable()
export class ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getArticleAllByParams(
    queryParams: IArticleQueryParamsRequered,
    currentUserId: number,
  ): Promise<ArticleBuildEntity[]> {
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

    console.log('articles', articles);

    return articles;
  }

  async getArticleBySlug(slug: string): Promise<ArticleBuildEntity> {
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

    const articleSerialize = exclude(article, ['authorId']);

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
    slugNew: string,
    articleUpdateDto: ArticleUpdateDto,
  ): Promise<ArticleBuildEntity> {
    const includeParams = {
      author: authorBaseSelect,
      favoritedBy: favoritedBaseSelect,
    };

    const data = {
      ...articleUpdateDto,
      slug: slugNew,
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
