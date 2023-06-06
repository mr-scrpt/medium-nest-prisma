import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@app/profile/profile.service';
import { ProfileBuildResponseDto } from '@app/profile/dto/profileBuildResponse.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @Param('username') username: string,
  ): Promise<ProfileBuildResponseDto> {
    return await this.profileService.getProfile(username);
  }
}
