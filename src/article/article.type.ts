import { Prisma } from '@prisma/client';
import { include } from './article.select';

export type PayloadInclude = Prisma.ArticleGetPayload<{
  include: typeof include;
}>;
