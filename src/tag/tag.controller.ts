import { Controller, Get, UsePipes } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from '@app/common/common.pipe';
import { ResTagListDto } from './dto/resTagList.dto';

@Controller('tags')
@ApiTags('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiCreatedResponse({ type: ResTagListDto })
  @Get()
  @UsePipes(new CustomValidationPipe())
  async findAll(): Promise<ResTagListDto> {
    return await this.tagService.findAll();
  }
}
