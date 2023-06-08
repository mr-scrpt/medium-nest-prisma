import { Controller, Get, UsePipes } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TagBuildResponseDto } from './dto/tagBuildResponse.dto';
import { CustomValidationPipe } from '@app/common/common.pipe';

@Controller('tags')
@ApiTags('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiCreatedResponse({ type: TagBuildResponseDto })
  @Get()
  @UsePipes(new CustomValidationPipe())
  async findAll(): Promise<TagBuildResponseDto> {
    return await this.tagService.findAll();
  }
}
