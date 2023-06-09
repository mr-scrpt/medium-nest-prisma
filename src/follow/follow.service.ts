import { ProfileService } from '@app/profile/profile.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FollowEntity } from './entity/follow.entity';
import { FollowRepository } from './follow.repository';

@Injectable()
export class FollowService {
  constructor(private readonly followRepository: FollowRepository) {}

  async isFollowing(currentUserId: number, userId: number): Promise<boolean> {
    console.log('currentUserId', currentUserId);
    console.log('userId', userId);
    const follow = await this.followRepository.getFollowData(
      currentUserId,
      userId,
    );
    return !!follow;
  }

  async checkIsFollowing(currentUserId: number, userId: number): Promise<void> {
    const follow = await this.isFollowing(currentUserId, userId);
    if (follow) {
      throw new HttpException('User already followed', HttpStatus.BAD_REQUEST);
    }
  }

  async checkIsNotFollowing(
    currentUserId: number,
    userId: number,
  ): Promise<void> {
    const follow = await this.isFollowing(currentUserId, userId);
    if (!follow) {
      throw new HttpException(
        'User already unfollowed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async followUser(
    currentUserId: number,
    userId: number,
  ): Promise<FollowEntity> {
    await this.checkIsNotCurrentUserFollow(currentUserId, userId);
    return await this.followRepository.followUser(currentUserId, userId);
  }

  async unfollowUser(
    currentUserId: number,
    userId: number,
  ): Promise<FollowEntity> {
    await this.checkIsCurrentUserFollow(currentUserId, userId);
    return await this.followRepository.unfollowUser(currentUserId, userId);
  }

  private async checkIsNotCurrentUserFollow(
    currentUserId: number,
    userId: number,
  ): Promise<void> {
    if (currentUserId === userId) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async checkIsCurrentUserFollow(
    currentUserId: number,
    userId: number,
  ): Promise<void> {
    if (currentUserId === userId) {
      throw new HttpException(
        'You cannot unfollow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
