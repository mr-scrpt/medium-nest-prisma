import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';

export class ReqArticleCreateDto {
  @ApiProperty({ type: ArticleCreateDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ArticleCreateDto)
  article: ArticleCreateDto;
}
