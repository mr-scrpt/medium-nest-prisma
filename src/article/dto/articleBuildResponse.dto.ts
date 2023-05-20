import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class ArticleBuildResponseDto {
  @ApiProperty({ type: ArticleCreateDto })
  @ValidateNested()
  article: ArticleCreateDto;
}
