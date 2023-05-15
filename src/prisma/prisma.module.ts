import { Module } from '@nestjs/common';
// import { PrismaService } from './prisma.service';
import { PrismaService } from '@app/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
