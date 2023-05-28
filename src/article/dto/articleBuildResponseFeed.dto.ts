import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleResponseDto } from './articleResponse.dto';

export class ArticleBuildResponseFeedDto {
  @ApiProperty({ type: ArticleResponseDto, isArray: true })
  @ValidateNested()
  articles: ArticleResponseDto[];

  @ApiProperty({ type: Number, example: 1 })
  articlesCount: number;
}
