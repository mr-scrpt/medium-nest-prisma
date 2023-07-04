import { ValidateNested } from 'class-validator';
import { CommentFullDataSerializedDto } from './commentFullDataSerialized.dto';

export class ResCommentListDto {
  @ValidateNested()
  comments: CommentFullDataSerializedDto[];
}
