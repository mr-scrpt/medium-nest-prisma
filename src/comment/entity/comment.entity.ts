import { Comment } from '@prisma/client';
export class CommentEntity implements Comment {
  id: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  articleId: number;
}
