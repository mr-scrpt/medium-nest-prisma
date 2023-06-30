import { Module } from '@nestjs/common';
import { ArticleToTagService } from '@app/articleToTag/articleToTag.service';
import { ArticleToTagRepository } from '@app/articleToTag/articleToTag.repository';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ArticleToTagService, ArticleToTagRepository],
  exports: [ArticleToTagService, ArticleToTagRepository],
})
export class ArticleToTagModule {}
