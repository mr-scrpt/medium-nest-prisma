import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserEntityResponse {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
