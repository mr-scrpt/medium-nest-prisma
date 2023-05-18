import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserClearDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The email of the User',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'token string',
    description: 'The token of the User',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'username',
    description: 'The username of the User',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'biography',
    description: 'The biography of the User',
  })
  @IsString()
  bio: string;

  @ApiProperty({
    example: 'image',
    description: 'The image of the User',
  })
  @IsString()
  image: string;
}
