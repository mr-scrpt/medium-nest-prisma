import { UserRepository } from '@app/user/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileClearDto } from './dto/profileClear.dto';
import { ProfileBuildResponseDto } from './dto/profileBuildResponse.dto';
import { ProfileResponseDto } from './dto/profileResponse.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(username: string): Promise<ProfileBuildResponseDto> {
    const user = await this.checkAndGetProfile(username);
    return this.buildProfileResponse({ ...user, following: false });
  }

  async checkAndGetProfile(username: string): Promise<ProfileClearDto> {
    const user = await this.userRepository.getUserByName(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
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
