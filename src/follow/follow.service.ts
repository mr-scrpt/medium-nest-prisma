import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FollowEntity } from '@app/follow/entity/follow.entity';
import { FollowCheck } from '@app/follow/follow.check';
import { FollowRepository } from '@app/follow/follow.repository';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly followCheck: FollowCheck,
  ) {}

  async isFollowing(currentUserId: number, userId: number): Promise<boolean> {
    const follow = await this.followRepository.getFollowData(
      currentUserId,
      userId,
    );
    return !!follow;
  }

  async checkIsFollowing(currentUserId: number, userId: number): Promise<void> {
    const follow = await this.isFollowing(currentUserId, userId);
    this.followCheck.isNotFollow(follow);
  }

  async checkIsNotFollowing(
    currentUserId: number,
    userId: number,
  ): Promise<void> {
    const follow = await this.isFollowing(currentUserId, userId);
    this.followCheck.isFollow(follow);
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
    const isNotYourself = currentUserId === userId;
    this.followCheck.isNotYourself(!!isNotYourself);
  }

  private async checkIsCurrentUserFollow(
    currentUserId: number,
    userId: number,
  ): Promise<void> {
    const isYourself = currentUserId === userId;
    this.followCheck.isYourself(!!isYourself);
  }
}
