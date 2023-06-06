import {
  Article,
  PrismaClient,
  Tag,
  User,
  UserToArticle,
} from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

const tagList: Array<Omit<Tag, 'id'>> = [
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

// password: password
const userList: Array<Omit<User, 'id'>> = [
  {
    username: 'Admin',
    email: 'test.admim@gmail.com',
    password:
      '$scrypt$N=32768,r=8,p=1,maxmem=67108864$qBE6nS2qFssoYSs3LDPHRkOH1iCWYJP8cGb+LFbnyVc$jKNNdSJOeKTNsZzuxuW9AIsCZjCAdaxtcVpSr0kXlNskT7XFj6itkrWOH6kIA68dMRvRgI/p7kW2mwbGaC+Y/Q',
    bio: 'lore ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
  },
  {
    username: 'TestUser',
    email: 'test@gmail.com',
    password:
      '$scrypt$N=32768,r=8,p=1,maxmem=67108864$qBE6nS2qFssoYSs3LDPHRkOH1iCWYJP8cGb+LFbnyVc$jKNNdSJOeKTNsZzuxuW9AIsCZjCAdaxtcVpSr0kXlNskT7XFj6itkrWOH6kIA68dMRvRgI/p7kW2mwbGaC+Y/Q',
    bio: 'elit sed do e lore ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore',
    image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
  },
];

const articleList: Array<Omit<Article, 'id'>> = [
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

const UserToArticleList: Array<UserToArticle> = [
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
  await execute(UserToArticleList, 'userToArticle', 'id');
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
