import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { FollowEntity } from './entity/follow.entity';

@Injectable()
export class FollowRepository {
  constructor(private prisma: PrismaService) {}

  async getFollowData(
    currentUserId: number,
    userId: number,
    prisma: Tx = this.prisma,
  ): Promise<FollowEntity> {
    const where = {
      followerId: currentUserId,
      followingId: userId,
    };

    return await prisma.userToUser.findFirst({
      where,
    });
  }

  async followUser(
    currentUserId: number,
    userId: number,
    prisma: Tx = this.prisma,
  ): Promise<FollowEntity> {
    return await prisma.userToUser.create({
      data: {
        followerId: currentUserId,
        followingId: userId,
      },
    });
  }

  async unfollowUser(
    currentUserId: number,
    userId: number,
    prisma: Tx = this.prisma,
  ): Promise<FollowEntity> {
    const where = {
      followerId: currentUserId,
      followingId: userId,
    };

    return await prisma.userToUser.delete({
      where: {
        followerId_followingId: where,
      },
    });
  }
}
