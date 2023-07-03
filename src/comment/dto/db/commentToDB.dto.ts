import { CommentCreateDto } from '../commentCreate.dto';
export class CommentToDBDto extends CommentCreateDto {
  authorId: number;
  articleId: number;
}
