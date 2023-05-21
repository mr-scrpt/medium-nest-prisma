import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserWithTokenDto } from './userWithToken.dto';

export class UserBuildResponseDto {
  @ApiProperty({ type: UserWithTokenDto })
  @ValidateNested()
  user: UserWithTokenDto;
}
