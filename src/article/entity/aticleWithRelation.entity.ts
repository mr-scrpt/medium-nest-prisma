import { UserAuthorEntity } from '@app/user/entity/userAuthor.entity';
import { ArticleToTag, UserToArticle } from '@prisma/client';
import { ArticleEntity } from './article.entity';

export class ArticleWithRelationEntity extends ArticleEntity {
  tagList: ArticleToTag[];

  favoritedBy: UserToArticle[];

  author: UserAuthorEntity;
}
