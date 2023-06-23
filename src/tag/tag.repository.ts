import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TagEntity } from './entity/tag.entity';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(driver: Tx = this.prisma): Promise<TagEntity[]> {
    return await driver.tag.findMany();
  }

  async getTagByName(name: string): Promise<TagEntity> {
    return await this.prisma.tag.findUnique({
      where: { name },
    });
  }

  async getUnusedTagList(driver: Tx = this.prisma): Promise<TagEntity[]> {
    return await driver.tag.findMany({
      where: {
        articles: {
          none: {}, // Ни одна статья не связана с тегом
        },
      },
    });
  }

  async createTag(name: string): Promise<TagEntity> {
    return await this.prisma.tag.create({
      data: { name },
    });
  }

  // async createTagByList(
  //   names: string[],
  //   driver: Tx = this.prisma,
  // ): Promise<TagEntity[]> {
  //   const createdTags: TagEntity[] = [];

  //   for (const name of names) {
  //     const createdTag = await driver.tag.create({
  //       data: {
  //         name: name,
  //       },
  //     });
  //     createdTags.push(createdTag);
  //   }

  //   return createdTags;
  // }
  //
  async createTagByList(
    tagListName: string[],
    driver: Tx = this.prisma,
  ): Promise<void> {
    await driver.tag.createMany({
      data: tagListName.map((name) => ({
        name,
      })),
      skipDuplicates: true,
    });
  }

  async getTagListByNameList(
    tagListName: string[],
    driver: Tx = this.prisma,
  ): Promise<TagEntity[]> {
    return await driver.tag.findMany({
      where: {
        name: {
          in: tagListName,
        },
      },
    });
  }

  async createArticleToTag(articleId: number, tagId: number): Promise<void> {
    await this.prisma.articleToTag.create({
      data: {
        articleId,
        tagId,
      },
    });
  }

  async getTagListByIds(tagIds: number[]): Promise<TagEntity[]> {
    return await this.prisma.tag.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },
    });
  }

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
}
