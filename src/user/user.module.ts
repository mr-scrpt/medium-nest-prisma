import { Module } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { AuthGuard } from '@app/auth/guard/auth.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  imports: [AuthModule, PrismaModule],
  exports: [UserService],
})
export class UserModule {}
