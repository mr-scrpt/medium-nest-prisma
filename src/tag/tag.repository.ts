import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TagEntity } from './entity/tag.entity';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(prisma: Tx = this.prisma): Promise<TagEntity[]> {
    return await prisma.tag.findMany();
  }

  async getTagByName(
    name: string,
    prisma: Tx = this.prisma,
  ): Promise<TagEntity> {
    return await prisma.tag.findUnique({
      where: { name },
    });
  }

  async getUnusedTagList(prisma: Tx = this.prisma): Promise<TagEntity[]> {
    return await prisma.tag.findMany({
      where: {
        articles: {
          none: {}, // Ни одна статья не связана с тегом
        },
      },
    });
  }

  async createTag(name: string, prisma: Tx = this.prisma): Promise<TagEntity> {
    return await prisma.tag.create({
      data: { name },
    });
  }

  async createTagByList(
    tagListName: string[],
    prisma: Tx = this.prisma,
  ): Promise<void> {
    await prisma.tag.createMany({
      data: tagListName.map((name) => ({
        name,
      })),
      skipDuplicates: true,
    });
  }

  async getTagListByNameList(
    tagListName: string[],
    prisma: Tx = this.prisma,
  ): Promise<TagEntity[]> {
    return await prisma.tag.findMany({
      where: {
        name: {
          in: tagListName,
        },
      },
    });
  }

  async createArticleToTag(
    articleId: number,
    tagId: number,
    prisma: Tx = this.prisma,
  ): Promise<void> {
    await prisma.articleToTag.create({
      data: {
        articleId,
        tagId,
      },
    });
  }

  async getTagListByIds(
    tagIds: number[],
    prisma: Tx = this.prisma,
  ): Promise<TagEntity[]> {
    return await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },
    });
  }

  async deleteUnuseTags(prisma: Tx = this.prisma): Promise<void> {
    const unusedTags = await this.getUnusedTagList(prisma);
    await prisma.tag.deleteMany({
      where: {
        id: {
          in: unusedTags.map((tag) => tag.id),
        },
      },
    });
  }
}
