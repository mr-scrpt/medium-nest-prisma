import { ApiProperty } from '@nestjs/swagger';

export class ArticleAuthorDto {
  @ApiProperty({ type: 'integer' })
  id: number;

  @ApiProperty({ type: 'string' })
  username: string;

  @ApiProperty({ type: 'string' })
  bio: string;

  @ApiProperty({ type: 'string' })
  image: string;
}
