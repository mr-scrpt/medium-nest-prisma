import { Module } from '@nestjs/common';
import { ProfileController } from '@app/profile/profile.controller';
import { ProfileService } from '@app/profile/profile.service';
import { UserModule } from '@app/user/user.module';
import { FollowModule } from '@app/follow/follow.module';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [UserModule, FollowModule, PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
