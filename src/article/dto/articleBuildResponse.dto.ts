import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleClearDto } from '@app/article/dto/articleClear.dto';

export class ArticleBuildResponseDto {
  @ApiProperty({ type: ArticleClearDto })
  @ValidateNested()
  article: ArticleClearDto;
}
