import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserEntity } from '@app/user/entity/user.entity';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(userCreateDto: UserCreateDto): Promise<UserEntity> {
    return await this.prisma.user.create({
      data: {
        ...userCreateDto,
      },
    });
  }

  async updateUser(id: number, data: UserUpdateDto): Promise<UserEntity> {
    const where = {
      id,
    };
    return await this.prisma.user.update({
      where,
      data,
    });
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    const where = {
      id,
    };
    return await this.prisma.user.findUnique({
      where,
    });
  }

  async getUserByName(username: string): Promise<UserEntity | null> {
    const where = {
      username,
    };
    return await this.prisma.user.findUnique({
      where,
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async checkEmailAndName(email: string, username: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });

    return user ? true : false;
  }
}
