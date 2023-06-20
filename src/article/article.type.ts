import { PrismaService } from '@app/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { include } from './article.select';

export type PayloadInclude = Prisma.ArticleGetPayload<{
  include: typeof include;
}>;

export type Tx = Omit<
  PrismaService,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;
