import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserLoginDto } from '@app/user/dto/userLogin.dto';

export class UserRequestLoginDto {
  @ApiProperty({ type: UserLoginDto })
  @ValidateNested()
  user: UserLoginDto;
}
