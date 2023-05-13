import { Module } from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { TagModule } from '@app/tag/tag.module';

@Module({
  imports: [TagModule],
  providers: [TagService],
})
export class AppModule {}
