import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ArticleUpdateDto {
  @ApiProperty({
    example: 'Title Article',
    description: 'Title to update article',
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'Description Article',
    description: 'Description to update article',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'Body Article',
    description: 'Body to update article',
  })
  @IsOptional()
  body: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Tags to update article',
  })
  @IsOptional()
  tagList?: string[];
}
