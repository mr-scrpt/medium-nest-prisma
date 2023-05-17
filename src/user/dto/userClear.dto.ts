import { ApiProperty } from '@nestjs/swagger';

export class UserClearDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The email of the User',
  })
  email: string;

  @ApiProperty({
    example: 'token string',
    description: 'The token of the User',
  })
  token: string;

  @ApiProperty({
    example: 'username',
    description: 'The username of the User',
  })
  username: string;

  @ApiProperty({
    example: 'biography',
    description: 'The biography of the User',
  })
  bio: string;

  @ApiProperty({
    example: 'image',
    description: 'The image of the User',
  })
  image: string;
}
