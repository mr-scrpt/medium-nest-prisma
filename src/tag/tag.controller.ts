import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TagEntity } from '@app/tag/entity/tag.entity';

@Controller('tags')
@ApiTags('article')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiCreatedResponse({ type: TagEntity, isArray: true })
  @Get()
  findAll(): Array<TagEntity> {
    return this.tagService.findAll();
  }
}
