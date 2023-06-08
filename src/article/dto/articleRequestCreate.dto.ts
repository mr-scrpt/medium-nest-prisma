import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';

export class ArticleRequestCreateDto {
  @ApiProperty({ type: ArticleCreateDto })
  @ValidateNested()
  article: ArticleCreateDto;
}
