import { Tag } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TagEntity implements Tag {
  @ApiProperty({ type: 'integer' })
  id: number;

  @ApiProperty()
  name: string;
}
