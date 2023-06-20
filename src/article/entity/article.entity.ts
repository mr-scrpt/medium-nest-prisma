import { Article } from '@prisma/client';

export class ArticleEntity implements Article {
  id: number;

  slug: string;

  title: string;

  description: string;

  body: string;

  createdAt: Date;

  updatedAt: Date;

  favoritesCount: number;

  authorId: number;
}
