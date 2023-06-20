import { Article, ArticleToTag, UserToArticle } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuthorEntity } from '@app/user/entity/userAuthor.entity';

export class ArticleBuildEntity implements Omit<Article, 'authorId'> {
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
  tagList?: ArticleToTag[];

  @ApiProperty({ type: 'string' })
  createdAt: Date;

  @ApiProperty({ type: 'string' })
  updatedAt: Date;

  @ApiProperty({ type: 'number' })
  favoritesCount: number;

  @ApiProperty({ type: 'object', isArray: true })
  favoritedBy?: UserToArticle[];

  @ApiProperty({ type: 'object' })
  author?: UserAuthorEntity;
}
