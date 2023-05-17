import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, TagModule, UserModule, AuthModule],
})
export class AppModule {}
