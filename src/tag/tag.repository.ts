import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TagEntity } from './entity/tag.entity';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findeAll(): Promise<TagEntity[]> {
    return await this.prisma.tag.findMany();
  }

  async getTagByName(name: string): Promise<TagEntity> {
    return await this.prisma.tag.findUnique({
      where: { name },
    });
  }

  async createTag(name: string): Promise<TagEntity> {
    return await this.prisma.tag.create({
      data: { name },
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
}
