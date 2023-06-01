import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { TagEntity } from './entity/tag.entity';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findeAll(): Promise<TagEntity[]> {
    return await this.prisma.tag.findMany();
  }
}
