import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class ArticleCreateDto {
  @ApiProperty({
    example: 'Title Article',
    description: 'Title to new article',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Description Article',
    description: 'Description to new article',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Body Article',
    description: 'Body to new article',
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Tags to new article',
  })
  // @ArrayNotEmpty()
  @IsString({ each: true })
  tagList: string[];
}
