import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserUpdateDto } from './userUpdate.dto';

export class UserRequestUpdateDto {
  @ApiProperty({ type: UserUpdateDto })
  @ValidateNested()
  user: UserUpdateDto;
}
