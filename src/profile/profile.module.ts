import { Module } from '@nestjs/common';
import { ProfileController } from '@app/profile/profile.controller';
import { ProfileService } from '@app/profile/profile.service';
import { UserRepository } from '@app/user/user.repository';
import { UserModule } from '@app/user/user.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { FollowRepository } from '@app/follow/follow.repository';
import { FollowService } from '@app/follow/follow.service';

@Module({
  imports: [UserModule],
  controllers: [ProfileController],
  providers: [
    UserRepository,
    FollowRepository,
    PrismaService,
    ProfileService,
    FollowService,
  ],
})
export class ProfileModule {}
