import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from '@app/profile/profile.service';
import { ProfileBuildResponseDto } from '@app/profile/dto/profileBuildResponse.dto';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { Token } from '@app/auth/iterface/auth.interface';
import { CustomValidationPipe } from '@app/common/common.pipe';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  @UsePipes(new CustomValidationPipe())
  async getProfile(
    @Param('username') username: string,
  ): Promise<ProfileBuildResponseDto> {
    return await this.profileService.getProfile(username);
  }

  @Get(':username/follow')
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationPipe())
  async followProfile(
    @Param('username') username: string,
    @Headers('Authorization') auth: Token,
  ): Promise<ProfileBuildResponseDto> {
    return await this.profileService.followProfile(username, auth);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  @UsePipes(new CustomValidationPipe())
  async unfollowProfile(
    @Param('username') username: string,
    @Headers('Authorization') auth: Token,
  ): Promise<ProfileBuildResponseDto> {
    return await this.profileService.unfollowProfile(username, auth);
  }
}
