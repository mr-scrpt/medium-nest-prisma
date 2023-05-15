import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TagResponseEntity } from './entity/tagResponse.entity';

@Controller('tags')
@ApiTags('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiCreatedResponse({ type: TagResponseEntity, isArray: true })
  @Get()
  async findAll(): Promise<TagResponseEntity> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
