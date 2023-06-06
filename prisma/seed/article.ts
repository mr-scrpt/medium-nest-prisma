import { Article } from '@prisma/client';

// password: password
export const articleList: Array<Omit<Article, 'id'>> = [
  {
    slug: 'how-to-train-your-dragon',
    title: 'How to train your dragon',
    description: 'Ever wonder how?',
    body: 'It takes a Jacobian',
    tagList: ['dragons', 'training'],
    createdAt: new Date(),
    updatedAt: new Date(),
    favoritesCount: 0,
    authorId: 1,
  },
  {
    slug: 'how-to-train-your-dragon-2',
    title: 'How to train your dragon 2',
    description: 'So toothless',
    body: 'It a dragon',
    tagList: ['dragons', 'training'],
    createdAt: new Date(),
    updatedAt: new Date(),
    favoritesCount: 0,
    authorId: 2,
  },
  {
    slug: 'how-to-train-your-dragon-3',
    title: 'How to train your dragon 3',
    description: 'So toothless',
    body: 'It a dragon',
    tagList: ['dragons', 'training'],
    createdAt: new Date(),
    updatedAt: new Date(),
    favoritesCount: 0,
    authorId: 1,
  },
];
