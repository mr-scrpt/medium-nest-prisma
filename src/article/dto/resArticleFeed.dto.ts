import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ArticleFullDataSerializedDto } from './articleFullDataSerialized.dto';

export class ResArticeFeedDto {
  @ApiProperty({ type: ArticleFullDataSerializedDto, isArray: true })
  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => ArticleFullDataSerializedDto)
  articles: ArticleFullDataSerializedDto[];

  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  articlesCount: number;
}
