import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'username', description: 'The username of the User' })
  readonly username: string;

  @ApiProperty({
    example: 'test.new@gmail.com',
    description: 'The email of the User',
  })
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the User',
  })
  readonly password: string;
}

export class UserCreateDto {
  @ApiProperty({ type: UserDto })
  @ValidateNested()
  user: UserDto;
}
