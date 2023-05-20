import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { UserEntity } from '@app/user/entity/user.entity';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { ArticleClearDto } from '@app/article/dto/articleClear.dto';
import { ArticleEntity } from '@app/article/entity/article.entity';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(
    user: UserEntity,
    articleCreateDto: ArticleCreateDto,
  ): Promise<ArticleEntity> {
    // const article = new ArticleEntity();
    const slug = slugify(articleCreateDto.title, {
      remove: undefined,
      lower: false,
      strict: false,
      locale: 'vi',
      trim: true,
    });

    const articleExist = await this.checkArticleExist(slug);
    if (articleExist) {
      throw new HttpException(
        'Article already exist',
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
        author: true,
      },
    });
    return articleCreated;
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.prisma.article.findUnique({
      where: {
        slug: slug,
      },
      include: {
        author: true,
      },
    });
    return article;
  }

  async checkArticleExist(slug: string): Promise<boolean> {
    const article = await this.getArticleBySlug(slug);
    if (!article) {
      return false;
    }
    return true;
  }

  buildArticleResponse(articleDto: ArticleClearDto): ArticleBuildResponseDto {
    return {
      article: {
        ...articleDto,
      },
    };
  }
}
