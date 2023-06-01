import { Module } from '@nestjs/common';
import { TagController } from '@app/tag/tag.controller';
import { TagService } from '@app/tag/tag.service';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TagRepository } from './tag.repository';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository],
  imports: [PrismaModule],
})
export class TagModule {}
