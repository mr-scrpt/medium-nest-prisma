import { UserClearDto } from '@app/user/dto/userClear.dto';
// import { UserEntity } from '@app/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsDate,
  IsNumber,
  MinLength,
} from 'class-validator';
import { ArticleUserDto } from './articleUserDto';

export class ArticleClearDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the article',
  })
  id: number;
  @ApiProperty({
    example: 'slug_url_string',
    description: 'Slug to new article',
  })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'Title Article',
    description: 'Title to new article',
  })
  @IsNotEmpty()
  @MinLength(8)
  title: string;

  @ApiProperty({
    example: 'Description Article',
    description: 'Description to new article',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Body Article',
    description: 'Body to new article',
  })
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Tags to new article',
  })
  @IsArray()
  tagList: string[];

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Date of creation of the article',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Date of update of the article',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: true,
    description: 'If the user is following the author of the article',
  })
  favorited: boolean;

  @ApiProperty({
    example: 0,
    description: 'Number of favorites for the article',
  })
  @IsNumber()
  favoritesCount: number;

  // @ApiProperty()
  // author: ArticleUserDto;
}
