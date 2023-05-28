import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserBuildEntity implements Omit<User, 'id' | 'password'> {
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  token: string;

  @ApiProperty({ type: 'string' })
  username: string;

  @ApiProperty({ type: 'string' })
  bio: string;

  @ApiProperty({ type: 'string' })
  image: string;
}
