import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { UserModule } from '@app/user/user.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CommonModule } from '@app/common/common.module';
import { ArticleRepository } from './article.repository';
import { TagService } from '@app/tag/tag.service';
import { TagRepository } from '@app/tag/tag.repository';

@Module({
  imports: [UserModule, PrismaModule, CommonModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleRepository, TagService, TagRepository],
})
export class ArticleModule {}
