import { User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserAuthorEntity implements Omit<User, 'password' | 'email'> {
  @ApiProperty({ type: 'integer' })
  id: number;

  @ApiProperty({ type: 'string' })
  username: string;

  @ApiProperty({ type: 'string', required: false })
  bio: string;

  @ApiProperty({ type: 'string', required: false })
  image: string;
}
