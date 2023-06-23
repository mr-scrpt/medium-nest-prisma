import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleToTagRepository {
  constructor(private readonly prisma: PrismaService) {}
  async deleteByArticleId(
    articleId: number,
    driver: Tx = this.prisma,
  ): Promise<void> {
    await driver.articleToTag.deleteMany({
      where: {
        articleId: articleId,
      },
    });
  }

  async deleteNotExistArticleToTag(
    articleId: number,
    existingTagIds: number[],
    driver: Tx = this.prisma,
  ): Promise<void> {
    await driver.articleToTag.deleteMany({
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
    driver: Tx = this.prisma,
  ): Promise<void> {
    await driver.articleToTag.createMany({
      data: newTags.map((tag) => ({
        articleId: articleId,
        tagId: tag.id,
      })),
    });
  }
}
