import { ApiProperty } from '@nestjs/swagger';
import { ProfileClearDto } from './profileClear.dto';

export class ProfileResponseDto extends ProfileClearDto {
  @ApiProperty({ example: true })
  following: boolean;
}
