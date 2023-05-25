import { ApiProperty } from '@nestjs/swagger';

export class ArticleUserDto {
  @ApiProperty({
    example: 'username',
    description: 'Username of the author of the article',
  })
  username: string;

  @ApiProperty({
    example: 'long text about biography',
    description: 'Bio of the author of the article',
  })
  bio: string;

  @ApiProperty({
    example: 'https://link-to-avatar.com',
    description: 'Avatar of the author of the article',
  })
  image: string;

  @ApiProperty({
    example: true,
    description: 'If the user is following the author of the article',
  })
  following: boolean;
}
