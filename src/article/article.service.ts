import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { UserEntity } from '@app/user/entity/user.entity';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { ArticleClearDto } from '@app/article/dto/articleClear.dto';
import { ArticleEntity } from '@app/article/entity/article.entity';
import slugify from 'slugify';
import { CommonService } from '@app/common/common.service';

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
  ) {}

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
          select: {
            username: true,
            email: true,
            bio: true,
            image: true,
          },
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
          select: {
            username: true,
            email: true,
            bio: true,
            image: true,
          },
        },
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

  buildArticleResponse(article: ArticleClearDto): ArticleBuildResponseDto {
    return { article };
  }
}
