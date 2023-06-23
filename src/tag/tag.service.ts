import { Injectable } from '@nestjs/common';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { TagRepository } from './tag.repository';
import { TagBuildResponseDto } from './dto/tagBuildResponse.dto';
import { ArticleToTag } from '@prisma/client';
import { Tx } from '@app/common/common.type';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}
  async findAll(): Promise<TagBuildResponseDto> {
    const tags = await this.tagRepository.findAll();
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

  getNotExistTagList(existingTag: TagEntity[], allTag: string[]): string[] {
    const existingTagName = existingTag.map((tag) => tag.name);
    return allTag.filter((tag) => !existingTagName.includes(tag));
  }

  // async tagCreateAndPrepareList(
  //   tagName: string[],
  //   tx: Tx,
  // ): Promise<TagEntity[]> {
  //   const tagPromises = tagName.map(async (tag) => {
  //     if (tag === '') {
  //       return null; // Пропускаем пустую строку
  //     }
  //     const existingTag = await tx.tag.findUnique({
  //       where: { name: tag },
  //     });

  //     if (existingTag) {
  //       return existingTag; // Используем уже существующий тег
  //     } else {
  //       // Создание нового тега
  //       const createdTag = await tx.tag.create({ data: { name: tag } });
  //       return createdTag;
  //     }
  //   });
  //   return await Promise.all(tagPromises);
  // }

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
