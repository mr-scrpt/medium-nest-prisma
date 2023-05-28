import { Module } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { CommonModule } from '@app/common/common.module';
import { UserRepository } from '@app/user/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthGuard, UserRepository],
  imports: [AuthModule, PrismaModule, CommonModule],
  exports: [UserService],
})
export class UserModule {}
