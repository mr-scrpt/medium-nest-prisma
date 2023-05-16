import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from '@app/user/user.module';

@Module({
  imports: [PrismaModule, TagModule, UserModule],
})
export class AppModule {}
