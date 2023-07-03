import { Injectable } from '@nestjs/common';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { TagRepository } from '@app/tag/tag.repository';
import { ArticleToTag } from '@prisma/client';
import { ResTagListDto } from '@app/tag/dto/resTagList.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findAll(): Promise<ResTagListDto> {
    const tags = await this.tagRepository.findAll();
    return this.buildTagListResponse(tags);
  }

  async createArticleToTag(
    articleId: number,
    tagList: TagEntity[],
  ): Promise<void> {
    const tagListCleaned = this.prepareTagList(tagList);
    const articleToTagPromises = tagListCleaned.map(async (tag) => {
      await this.tagRepository.createArticleToTag(articleId, tag.id);
    });

    await Promise.all(articleToTagPromises);
  }

  async getTagListByEntity(atricleToTag: ArticleToTag[]): Promise<string[]> {
    const tagIds = atricleToTag.map((tag) => tag.tagId);
    const tagList = await this.tagRepository.getTagListByIds(tagIds);
    return tagList.map((tag) => tag.name);
  }

  getNotExistTagList(existingTag: TagEntity[], allTag: string[]): string[] {
    const existingTagName = existingTag.map((tag) => tag.name);
    return allTag.filter((tag) => !existingTagName.includes(tag));
  }

  tagListNormolized(tagList: string[]): string[] {
    if (!tagList) {
      return [];
    }
    return tagList.map((tag) => this.tagNormolized(tag));
  }

  private prepareTagList(tagList: TagEntity[]): TagEntity[] {
    return tagList.map((tag) => {
      if (tag && tag.name) {
        return { ...tag, name: this.tagNormolized(tag.name) };
      }
    });
  }
  private tagNormolized(tag: string): string {
    return tag.trim().toLowerCase();
  }

  private buildTagListResponse(tags: TagEntity[]): ResTagListDto {
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
