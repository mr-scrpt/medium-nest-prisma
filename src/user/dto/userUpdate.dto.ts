import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    example: 'username',
    description: 'The username of the User',
    required: false,
  })
  @IsOptional()
  readonly username?: string;

  @ApiProperty({
    example: 'test.new@gmail.com',
    description: 'The email of the User',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the User',
    required: false,
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'passwordNew',
    description: 'The new password of the User',
    required: false,
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  passwordOld?: string;

  @ApiProperty({
    example: 'text about me',
    description: 'The bio of the User',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly bio?: string;

  @ApiProperty({
    example: 'https://image.com/image.jpg',
    description: 'The image of the User',
    required: false,
  })
  readonly image?: string;
}
