import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { FollowEntity } from './entity/follow.entity';

@Injectable()
export class FollowRepository {
  constructor(private prisma: PrismaService) {}

  async getFollowData(
    currentUserId: number,
    userId: number,
  ): Promise<FollowEntity> {
    const where = {
      followerId: currentUserId,
      followingId: userId,
    };

    return await this.prisma.userToUser.findFirst({
      where,
    });
  }

  async followUser(
    currentUserId: number,
    userId: number,
  ): Promise<FollowEntity> {
    return await this.prisma.userToUser.create({
      data: {
        followerId: currentUserId,
        followingId: userId,
      },
    });
  }

  async unfollowUser(
    currentUserId: number,
    userId: number,
  ): Promise<FollowEntity> {
    const where = {
      followerId: currentUserId,
      followingId: userId,
    };

    return await this.prisma.userToUser.delete({
      where: {
        followerId_followingId: where,
      },
    });
  }
}
