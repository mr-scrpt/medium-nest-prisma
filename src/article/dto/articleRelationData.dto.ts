import { UserAuthorEntity } from '@app/user/entity/userAuthor.entity';
import { ArticleToTag, UserToArticle } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ArticleWithRelationEntity } from '../entity/aticleWithRelation.entity';

export class ArticleRelationDataDto implements ArticleWithRelationEntity {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  @IsNotEmpty()
  @IsNumber()
  favoritesCount: number;

  @IsNotEmpty()
  @IsNumber()
  authorId: number;

  @IsArray()
  tagList: ArticleToTag[];

  @IsArray()
  favoritedBy: UserToArticle[];

  @IsNotEmpty()
  @IsBoolean()
  favorited: boolean;

  @IsNotEmpty()
  author: UserAuthorEntity;
}
