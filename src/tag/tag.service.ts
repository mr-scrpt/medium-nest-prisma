import { Injectable } from '@nestjs/common';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { TagRepository } from './tag.repository';
import { TagBuildResponseDto } from './dto/tagBuildResponse.dto';
import { ArticleToTag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}
  async findAll(): Promise<TagBuildResponseDto> {
    const tags = await this.tagRepository.findeAll();
    return this.buildTagsResponse(tags);
  }

  async createArticleToTag(
    articleId: number,
    tagList: TagEntity[],
  ): Promise<void> {
    const articleToTagPromises = [...tagList].map(async (tag) => {
      if (tag && tag.name) {
        await this.tagRepository.createArticleToTag(articleId, tag.id);
      }
    });

    await Promise.all(articleToTagPromises);
  }

  async getTagListByEntity(atricleToTag: ArticleToTag[]): Promise<string[]> {
    const tagIds = atricleToTag.map((tag) => tag.tagId);
    const tagList = await this.tagRepository.getTagListByIds(tagIds);
    return tagList.map((tag) => tag.name);
  }

  private buildTagsResponse(tags: TagEntity[]): TagBuildResponseDto {
    return {
      tags: tags.map((tag) => tag.name),
    };
  }

  tagListNormolized(tagList: string[]): string[] {
    if (!tagList) {
      return [];
    }
    return tagList.map((tag) => tag.trim().toLowerCase());
  }
}
