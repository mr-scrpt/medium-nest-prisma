import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleClearDto } from '@app/article/dto/articleClear.dto';

export class ArticleFeedBuildResponseDto {
  @ApiProperty({ type: ArticleClearDto, isArray: true })
  @ValidateNested()
  articles: ArticleClearDto[];

  @ApiProperty({ type: Number, example: 1 })
  articlesCount: number;
}
