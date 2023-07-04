import { PrismaModule } from '@app/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CommentCheck } from './comment.check';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [PrismaModule],
  providers: [CommentService, CommentRepository, CommentCheck],
  exports: [CommentService],
})
export class CommentModule {}
