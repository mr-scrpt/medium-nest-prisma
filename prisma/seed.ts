import { PrismaClient, Tag } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

const tag: Array<Tag> = [
  {
    id: 1,
    name: 'dragon',
  },
  {
    id: 2,
    name: 'nest',
  },
];

// const userList = [
//   {
//     id: '1',
//     name: 'Super',
//     email: 'test@gmail.com',
//     password: '123456',
//   },
// ];

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
  await execute(tag, 'tag', 'name');
  // await execute(userList, 'user', 'id');
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
