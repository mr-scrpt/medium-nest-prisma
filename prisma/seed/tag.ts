import { Tag } from '@prisma/client';

export const tagList: Array<Omit<Tag, 'id'>> = [
  {
    name: 'dragon',
  },
  {
    name: 'coffee',
  },
  {
    name: 'nest',
  },
];
