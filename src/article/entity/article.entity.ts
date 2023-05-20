import { Article } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
// import { UserEntity } from '@app/user/entity/user.entity';

export class ArticleEntity implements Article {
  @ApiProperty({ type: 'integer' })
  id: number;

  @ApiProperty({ type: 'string' })
  slug: string;

  @ApiProperty({ type: 'string' })
  title: string;

  @ApiProperty({ type: 'string' })
  description: string;

  @ApiProperty({ type: 'string' })
  body: string;

  @ApiProperty({ type: 'string', isArray: true })
  tagList: string[];

  @ApiProperty({ type: 'string' })
  createdAt: Date;

  @ApiProperty({ type: 'string' })
  updatedAt: Date;

  @ApiProperty({ type: 'number' })
  favoritesCount: number;

  @ApiProperty({ type: 'number' })
  authorId: number;
}
