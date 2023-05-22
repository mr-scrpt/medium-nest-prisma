import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserClearDto } from '@app/user/dto/userClear.dto';

export class UserBuildClearResponseDto {
  @ApiProperty({ type: UserClearDto })
  @ValidateNested()
  user: UserClearDto;
}
