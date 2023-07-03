import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CommentCreateDto {
  @ApiProperty({
    example: 'Long text comment body',
  })
  @IsNotEmpty()
  body: string;
}
