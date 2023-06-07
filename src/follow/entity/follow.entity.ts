import { ApiProperty } from '@nestjs/swagger';
import { UserToUser } from '@prisma/client';

export class FollowEntity implements UserToUser {
  @ApiProperty({ type: 'integer' })
  id: number;

  @ApiProperty({ type: 'integer' })
  followerId: number;

  @ApiProperty({ type: 'integer' })
  followingId: number;
}
