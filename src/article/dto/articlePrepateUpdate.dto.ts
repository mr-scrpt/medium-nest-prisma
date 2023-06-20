import { OmitType } from '@nestjs/swagger';
import { ArticleUpdateDto } from './articleUpdate.dto';

export class ArticlePrepareUpdateDto extends OmitType(ArticleUpdateDto, [
  'tagList',
]) {}
