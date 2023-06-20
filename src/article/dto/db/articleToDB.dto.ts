import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ArticleCreateDto } from '../articleCreate.dto';

export class ArticleToDBDto extends OmitType(ArticleCreateDto, ['tagList']) {
  @IsNotEmpty()
  @IsString()
  slug: string;
  @IsNotEmpty()
  @IsNumber()
  authorId: number;
}
