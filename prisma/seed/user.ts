import { User } from '@prisma/client';

export const userList: Array<Omit<User, 'id'>> = [
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
