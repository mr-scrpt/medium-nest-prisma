import { UserToArticle } from '@prisma/client';

export const userToArticleList: Array<UserToArticle> = [
  {
    id: 1,
    userId: 1,
    articleId: 1,
  },
  {
    id: 2,
    userId: 2,
    articleId: 1,
  },

  {
    id: 3,
    userId: 1,
    articleId: 2,
  },
  {
    id: 4,
    userId: 2,
    articleId: 3,
  },
];
