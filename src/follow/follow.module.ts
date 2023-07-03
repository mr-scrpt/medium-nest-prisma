import { PrismaModule } from '@app/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { FollowCheck } from '@app/follow/follow.check';
import { FollowRepository } from '@app/follow/follow.repository';
import { FollowService } from '@app/follow/follow.service';

@Module({
  imports: [PrismaModule],
  providers: [FollowRepository, FollowService, FollowCheck],
  exports: [FollowService, FollowRepository],
})
export class FollowModule {}
