import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { UserEntity } from '@app/user/entity/user.entity';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { ArticleClearDto } from '@app/article/dto/articleClear.dto';
import { CommonService } from '@app/common/common.service';
import { authorBaseSelect } from '@app/article/article.select';
import { UserService } from '@app/user/user.service';
import { ArticleUpdateDto } from '@app/article/dto/articleUpdate.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
    private readonly user: UserService,
  ) {}

  async findAll(user: UserEntity, query: any): Promise<any> {
    const { offset, limit } = query;
    const articles = await this.prisma.article.findMany({
      take: limit,
      skip: offset,
      include: {
        author: {
          select: authorBaseSelect,
        },
      },
    });
    console.log('article lis', articles);
    return articles;
  }
  async createArticle(
    user: UserEntity,
    articleCreateDto: ArticleCreateDto,
  ): Promise<ArticleClearDto> {
    const slug = this.common.slugGenerator(articleCreateDto.title);

    const articleExist = await this.checkArticleExist(slug);
    if (articleExist) {
      throw new HttpException(
        'An article with this slug already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const data = {
      authorId: user.id,
      slug,
      ...articleCreateDto,
    };
    const articleCreated = await this.prisma.article.create({
      data: data,
      include: {
        author: {
          select: authorBaseSelect,
        },
      },
    });
    return articleCreated;
  }

  async getArticleBySlug(slug: string): Promise<ArticleClearDto> {
    const article = await this.prisma.article.findUnique({
      where: {
        slug: slug,
      },
      include: {
        author: {
          select: authorBaseSelect,
        },
      },
    });
    return article;
  }

  async deleteArticleBySlug(id: number, slug: string): Promise<void> {
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: authorBaseSelect,
        },
      },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.authorId !== id) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.article.delete({
      where: {
        slug: slug,
      },
    });
  }

  async updateArticleBySlug(
    id: number,
    slug: string,
    articleUpdatedDto: ArticleUpdateDto,
  ): Promise<ArticleClearDto> {
    const IsNotEmptyObject = this.common.IsNotEmptyObject(articleUpdatedDto);
    if (!IsNotEmptyObject) {
      throw new HttpException(
        'At least one field must be filled',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const article = await this.prisma.article.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: authorBaseSelect,
        },
      },
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.authorId !== id) {
      throw new HttpException(
        'You are not the author of this article',
        HttpStatus.FORBIDDEN,
      );
    }

    const slugNew = this.common.slugGenerator(articleUpdatedDto.title);
    const existSlug = await this.checkArticleExist(slugNew);

    if (existSlug) {
      throw new HttpException(
        'An article with this slug already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const data = {
      ...articleUpdatedDto,
      slug: slugNew,
    };

    const articleUpdated = await this.prisma.article.update({
      where: {
        slug: slug,
      },
      data: {
        // updatedAt: new Date(),
        ...data,
      },
      include: {
        author: {
          select: authorBaseSelect,
        },
      },
    });
    return articleUpdated;
  }

  async checkArticleExist(slug: string): Promise<boolean> {
    const article = await this.getArticleBySlug(slug);
    if (!article) {
      return false;
    }
    return true;
  }

  buildArticleResponse(article: ArticleClearDto): ArticleBuildResponseDto {
    return { article };
  }
}
