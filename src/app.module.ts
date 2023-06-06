import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from '@app/user/user.module';
import { AuthModule } from '@app/auth/auth.module';
import { ArticleModule } from '@app/article/article.module';
import { CommonModule } from '@app/common/common.module';
import { ProfileModule } from '@app/profile/profile.module';

@Module({
  imports: [
    PrismaModule,
    TagModule,
    UserModule,
    AuthModule,
    ArticleModule,
    CommonModule,
    ProfileModule,
  ],
})
export class AppModule {}
