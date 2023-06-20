import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ArticleUpdateDto {
  @ApiProperty({
    example: 'Title Article',
    description: 'Title to new article',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Description Article',
    description: 'Description to new article',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Body Article',
    description: 'Body to new article',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    example: ['tag1', 'tag2'],
    description: 'Tags to new article',
  })
  // @ArrayNotEmpty()
  @IsOptional()
  @IsString({ each: true })
  tagList?: string[];
}
