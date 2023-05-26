import { Article, User, UserToArticle } from '@prisma/client';
import { ArticleUserDto } from '../dto/articleUserDto';
// import { Prisma } from '@prisma/client';

export interface IArticleWithAuthorAndFavoritedBy extends Article {
  author: ArticleUserDto;
  favoritedBy: UserToArticle[];
}

export interface IArticleDBDto extends Article {
  author?: User;
  favoritedBy?: UserToArticle[];
}
// export type CreateArticle = Prisma.PromiseReturnType<typeof Article>;
