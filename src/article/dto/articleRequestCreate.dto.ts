import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';
import { Type } from 'class-transformer';

export class ArticleRequestCreateDto {
  @ApiProperty({ type: ArticleCreateDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ArticleCreateDto)
  article: ArticleCreateDto;
}
