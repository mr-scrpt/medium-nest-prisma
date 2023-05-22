import { UserClearDto } from '@app/user/dto/userClear.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserWithTokenDto extends UserClearDto {
  @ApiProperty({
    example: 'token_string',
    description: 'Token to user',
  })
  @IsString()
  token: string;
}
