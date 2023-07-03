import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';

export class ResTagListDto {
  @ApiProperty({ example: ['tag1', 'tag2'] })
  @ValidateNested()
  @IsArray()
  tags: Array<string>;
}
