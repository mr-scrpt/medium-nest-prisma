import { OmitType } from '@nestjs/swagger';
import { ArticleCreateDto } from '@app/article/dto/articleCreate.dto';

export class ArticlePrepareCreateDto extends OmitType(ArticleCreateDto, [
  'tagList',
]) {}
