import { Module } from '@nestjs/common';
import { ProfileController } from '@app/profile/profile.controller';
import { ProfileService } from '@app/profile/profile.service';
import { UserRepository } from '@app/user/user.repository';
import { UserModule } from '@app/user/user.module';
import { PrismaService } from '@app/prisma/prisma.service';

@Module({
  imports: [UserModule],
  controllers: [ProfileController],
  providers: [UserRepository, PrismaService, ProfileService],
})
export class ProfileModule {}
