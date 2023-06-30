import { PrismaService } from '@app/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { FollowService } from './follow.service';

@Module({
  providers: [FollowRepository, FollowService, PrismaService],
  exports: [FollowService, FollowRepository],
})
export class FollowModule {}
