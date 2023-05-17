import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';

export class UserRequestCreateDto {
  @ApiProperty({ type: UserCreateDto })
  @ValidateNested()
  user: UserCreateDto;
}
