import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({ example: 'username', description: 'The username of the User' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    example: 'test.new@gmail.com',
    description: 'The email of the User',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the User',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
