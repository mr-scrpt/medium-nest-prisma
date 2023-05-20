import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { UserModule } from '@app/user/user.module';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
