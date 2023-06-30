import { CommonModule } from '@app/common/common.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { UserModule } from '@app/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [forwardRef(() => UserModule), PrismaModule, CommonModule],
  exports: [AuthService],
})
export class AuthModule {}
