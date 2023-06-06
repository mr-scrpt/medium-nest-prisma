import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ProfileResponseDto } from './profileResponse.dto';

export class ProfileBuildResponseDto {
  @ApiProperty({ type: ProfileResponseDto })
  @ValidateNested()
  profile: ProfileResponseDto;
}
