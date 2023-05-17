import { Module } from '@nestjs/common';

import { UserService } from '@app/user/user.service';

import { UserController } from '@app/user/user.controller';

import { AuthModule } from '@app/auth/auth.module';

import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, PrismaModule],
})
export class UserModule {}
