import { Injectable } from '@nestjs/common';
import { TagEntity } from '@app/tag/entity/tag.entity';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(): Promise<Array<TagEntity>> {
    return await this.prisma.tag.findMany();
  }
}
