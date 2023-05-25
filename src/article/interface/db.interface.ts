import { Article, UserToArticle } from '@prisma/client';
import { ArticleUserDto } from '../dto/articleUserDto';

export interface IArticleWithAuthorAndFavoritedBy extends Article {
  author: ArticleUserDto;
  favoritedBy: UserToArticle[];
}
