import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleUpdateDto } from '@app/article/dto/articleUpdate.dto';

export class ArticleRequestUpdateDto {
  @ApiProperty({ type: ArticleUpdateDto })
  @ValidateNested()
  article: ArticleUpdateDto;
}
