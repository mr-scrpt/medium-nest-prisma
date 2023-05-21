import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserUpdateDto } from '@app/user/dto/userUpdate.dto';

export class UserRequestUpdateDto {
  @ApiProperty({ type: UserUpdateDto })
  @ValidateNested()
  user: UserUpdateDto;
}
