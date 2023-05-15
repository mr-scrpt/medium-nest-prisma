import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TagModule } from '@app/tag/tag.module';

@Module({
  imports: [PrismaModule, TagModule],
})
export class AppModule {}
