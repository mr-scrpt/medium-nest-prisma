import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ArticleCreateDto {
  @ApiProperty({
    example: 'Title Article',
    description: 'Title to new article',
  })
  @IsNotEmpty()
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
  @IsOptional()
  tagList?: string[];
}
