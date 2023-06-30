import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { UserModule } from '@app/user/user.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CommonModule } from '@app/common/common.module';
import { ArticleRepository } from './article.repository';
import { ArticleToTagModule } from '@app/articleToTag/articleToTag.module';
import { ArticleTransaction } from './article.transaction';
import { ArticleCheck } from './article.check';
import { TagModule } from '@app/tag/tag.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    CommonModule,
    ArticleToTagModule,
    TagModule,
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleRepository,
    ArticleTransaction,
    ArticleCheck,
  ],
})
export class ArticleModule {}
