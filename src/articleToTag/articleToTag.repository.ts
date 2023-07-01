import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleToTagRepository {
  constructor(private readonly prisma: PrismaService) {}
  async deleteByArticleId(
    articleId: number,
    prisma: Tx = this.prisma,
  ): Promise<void> {
    await prisma.articleToTag.deleteMany({
      where: {
        articleId: articleId,
      },
    });
  }

  async deleteNotExistArticleToTag(
    articleId: number,
    existingTagIds: number[],
    prisma: Tx = this.prisma,
  ): Promise<void> {
    await prisma.articleToTag.deleteMany({
      where: {
        articleId: articleId,
        tagId: {
          notIn: existingTagIds,
        },
      },
    });
  }

  async createNewArticleToTag(
    articleId: number,
    newTags: TagEntity[],
    prisma: Tx = this.prisma,
  ): Promise<void> {
    await prisma.articleToTag.createMany({
      data: newTags.map((tag) => ({
        articleId: articleId,
        tagId: tag.id,
      })),
    });
  }
}
