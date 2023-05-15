import { ApiProperty } from '@nestjs/swagger';

export class TagResponseEntity {
  @ApiProperty()
  tags: Array<string>;
}
