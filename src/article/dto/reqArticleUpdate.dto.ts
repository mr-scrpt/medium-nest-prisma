import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleUpdateDto } from './articleUpdate.dto';

export class ReqArticleUpdateDto {
  @ApiProperty({ type: ArticleUpdateDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ArticleUpdateDto)
  article: ArticleUpdateDto;
}
