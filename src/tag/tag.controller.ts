import { Controller, Get } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TagBuildResponseDto } from './dto/tagBuildResponse.dto';

@Controller('tags')
@ApiTags('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiCreatedResponse({ type: TagBuildResponseDto })
  @Get()
  async findAll(): Promise<TagBuildResponseDto> {
    return await this.tagService.findAll();
  }
}
