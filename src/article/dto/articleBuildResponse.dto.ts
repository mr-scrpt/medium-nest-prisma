import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleResponseDto } from './articleResponse.dto';

export class ArticleBuildResponseDto {
  @ApiProperty({ type: ArticleResponseDto })
  @ValidateNested()
  article: ArticleResponseDto;
}
