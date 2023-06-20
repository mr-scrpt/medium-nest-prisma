import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { ArticleFullDataSerializedDto } from './articleFullDataSerialized.dto';

export class ResArticleDto {
  // @ApiProperty({ type: ArticleFullDataSerializedDto })
  // @IsDefined()
  // @IsArray()
  @ValidateNested()
  // @Type(() => ArticleFullDataSerializedDto)
  article: ArticleFullDataSerializedDto;
}
