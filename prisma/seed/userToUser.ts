import { UserToUser } from '@prisma/client';

export const userToUser: Array<UserToUser> = [
  {
    id: 1,
    followerId: 1,
    followingId: 2,
  },
  {
    id: 2,
    followerId: 1,
    followingId: 3,
  },
];
