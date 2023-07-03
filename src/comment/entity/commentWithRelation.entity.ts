import { UserAuthorEntity } from '@app/user/entity/userAuthor.entity';
import { CommentEntity } from '@app/comment/entity/comment.entity';

export class CommentWithRelationEntity extends CommentEntity {
  author: UserAuthorEntity;
}
