import { UserAuthorEntity } from '@app/user/entity/userAuthor.entity';
import { CommentWithRelationEntity } from '../entity/commentWithRelation.entity';

export class CommentWithRelationDto implements CommentWithRelationEntity {
  id: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  articleId: number;
  author: UserAuthorEntity;
}
