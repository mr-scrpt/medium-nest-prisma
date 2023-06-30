import { Injectable } from '@nestjs/common';
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
    await this.checkProfileByName(username);
    const user = await this.getProfileByName(username);
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
    await this.checkProfileByName(username);
    const user = await this.getProfileByName(username);
    await this.followService.checkIsFollowing(userCurrent.id, user.id);
    await this.followService.followUser(userCurrent.id, user.id);
    return this.buildProfileResponse({ ...user, following: true });
  }

  async unfollowProfile(
    username: string,
    token: Token,
  ): Promise<ProfileBuildResponseDto> {
    const userCurrent = await this.userService.getUserByToken(token);
    await this.checkProfileByName(username);
    const user = await this.getProfileByName(username);
    await this.followService.checkIsNotFollowing(userCurrent.id, user.id);
    await this.followService.unfollowUser(userCurrent.id, user.id);
    return this.buildProfileResponse({ ...user, following: false });
  }

  private async checkProfileByName(username: string): Promise<boolean> {
    return await this.userService.checkUserByName(username);
  }

  private async getProfileByName(username: string): Promise<ProfileDto> {
    return await this.userService.getUserByName(username);
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
