import { Injectable } from '@nestjs/common';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { TagRepository } from './tag.repository';
import { TagBuildResponseDto } from './dto/tagBuildResponse.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}
  async findAll(): Promise<TagBuildResponseDto> {
    const tags = await this.tagRepository.findeAll();
    return this.buildTagsResponse(tags);
  }

  private buildTagsResponse(tags: TagEntity[]): TagBuildResponseDto {
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
