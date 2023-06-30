import { forwardRef, Module } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';
import { AuthModule } from '@app/auth/auth.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CommonModule } from '@app/common/common.module';
import { UserRepository } from '@app/user/user.repository';
import { UserCheck } from './user.check';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserCheck],
  imports: [forwardRef(() => AuthModule), PrismaModule, CommonModule],
  exports: [UserService, UserCheck],
})
export class UserModule {}
