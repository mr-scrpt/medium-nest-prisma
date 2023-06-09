import { Injectable } from '@nestjs/common';
import { ProfileClearDto } from './dto/profileClear.dto';
import { ProfileBuildResponseDto } from './dto/profileBuildResponse.dto';
import { ProfileResponseDto } from './dto/profileResponse.dto';
import { UserService } from '@app/user/user.service';
import { FollowService } from '@app/follow/follow.service';
import { Token } from '@app/auth/iterface/auth.interface';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UserService,
    private readonly followService: FollowService,
  ) {}

  async getProfile(
    username: string,
    token: Token,
  ): Promise<ProfileBuildResponseDto> {
    const userCurrent = await this.userService.getUserByToken(token);
    const user = await this.checkAndGetProfile(username);
    const isFollowing = await this.followService.isFollowing(
      userCurrent.id,
      user.id,
    );
    return this.buildProfileResponse({ ...user, following: isFollowing });
  }

  async followProfile(
    username: string,
    token: Token,
  ): Promise<ProfileBuildResponseDto> {
    const userCurrent = await this.userService.getUserByToken(token);
    const user = await this.userService.checkAndGetUserByName(username);
    await this.followService.checkIsFollowing(userCurrent.id, user.id);
    await this.followService.followUser(userCurrent.id, user.id);
    return this.buildProfileResponse({ ...user, following: true });
  }

  async unfollowProfile(
    username: string,
    token: Token,
  ): Promise<ProfileBuildResponseDto> {
    const userCurrent = await this.userService.getUserByToken(token);
    const user = await this.userService.checkAndGetUserByName(username);
    await this.followService.checkIsNotFollowing(userCurrent.id, user.id);
    await this.followService.unfollowUser(userCurrent.id, user.id);
    return this.buildProfileResponse({ ...user, following: false });
  }

  private async checkAndGetProfile(username: string): Promise<ProfileDto> {
    const user = await this.userService.checkAndGetUserByName(username);
    return user;
  }

  private buildProfileResponse(
    user: ProfileResponseDto,
  ): ProfileBuildResponseDto {
    const { username, bio, image, following } = user;
    return {
      profile: {
        username,
        bio,
        image,
        following,
      },
    };
  }
}
