import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class TagBuildResponseDto {
  @ApiProperty({ example: ['tag1', 'tag2'] })
  @ValidateNested()
  tags: string[];
}
