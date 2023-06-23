import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { UserModule } from '@app/user/user.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CommonModule } from '@app/common/common.module';
import { ArticleRepository } from './article.repository';
import { TagService } from '@app/tag/tag.service';
import { TagRepository } from '@app/tag/tag.repository';
import { ArticleToTagRepository } from '@app/articleToTag/articleToTag.repository';
import { Transaction } from '@app/common/common.transaction';
import { ArticleToTagModule } from '@app/articleToTag/articleToTag.module';
import { ArticleTransaction } from './article.transaction';
import { ArticleCheck } from './article.check';

@Module({
  imports: [UserModule, PrismaModule, CommonModule, ArticleToTagModule],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    ArticleRepository,
    TagService,
    TagRepository,
    ArticleToTagRepository,
    Transaction,
    ArticleTransaction,
    ArticleCheck,
  ],
})
export class ArticleModule {}
