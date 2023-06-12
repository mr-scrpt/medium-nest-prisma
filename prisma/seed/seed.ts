import { PrismaClient } from '@prisma/client';

import { tagList, userList, articleList, userToArticleList } from '.';
import { articleToTag } from './articleToTag';
import { userToUser } from './userToUser';

// initialize Prisma Client
const prisma = new PrismaClient();

type Entity = {
  [key: string]: any;
};

async function execute<T extends Entity, K extends keyof T>(
  list: Array<T>,
  entity: string,
  where: K,
) {
  for await (const item of list) {
    const result = await prisma[entity].upsert({
      where: { [where]: item[where] },
      update: {},
      create: {
        ...item,
      },
    });

    console.dir({ result });
  }
}

async function main() {
  await execute(tagList, 'tag', 'name');
  await execute(userList, 'user', 'email');
  await execute(articleList, 'article', 'slug');
  await execute(userToArticleList, 'userToArticle', 'id');
  await execute(userToUser, 'userToUser', 'id');
  await execute(articleToTag, 'articleToTag', 'id');
}
// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
