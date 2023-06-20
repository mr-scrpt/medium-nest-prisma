import { OmitType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsString } from 'class-validator';
import { ArticleRelationDataDto } from './articleRelationData.dto';
export class ArticleFullDataSerializedDto extends OmitType(
  ArticleRelationDataDto,
  ['tagList'],
) {
  @ArrayNotEmpty()
  @IsString({ each: true })
  tagList: string[];
}
