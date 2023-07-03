import { OmitType } from '@nestjs/swagger';
import { CommentWithRelationDto } from './commentWithRelatio.dto';

export class CommentFullDataSerializedDto extends OmitType(
  CommentWithRelationDto,
  ['authorId', 'articleId'],
) {}
