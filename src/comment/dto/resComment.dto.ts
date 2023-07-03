import { ValidateNested } from 'class-validator';
import { CommentFullDataSerializedDto } from './commentFullDataSerialized.dto';

export class ResCommentDto {
  @ValidateNested()
  comment: CommentFullDataSerializedDto;
}
