import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [PrismaModule, TagModule, UserModule, AuthModule, ArticleModule],
})
export class AppModule {}
