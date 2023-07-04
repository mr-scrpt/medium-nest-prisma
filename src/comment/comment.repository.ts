import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { CommentEntity } from '@app/comment/entity/comment.entity';
import { CommentWithRelationEntity } from '@app/comment/entity/commentWithRelation.entity';
import { CommentToDBDto } from '@app/comment/dto/db/commentToDB.dto';
import { Injectable } from '@nestjs/common';
import { include } from './comment.select';

@Injectable()
export class CommentRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createComment(
    data: CommentToDBDto,
    prisma: Tx = this.prisma,
  ): Promise<CommentEntity> {
    return await prisma.comment.create({ data, include });
  }

  async getCommentById(
    id: number,
    prisma: Tx = this.prisma,
  ): Promise<CommentWithRelationEntity> {
    const where = {
      id,
    };

    const comment = await prisma.comment.findUnique({
      where,
      include,
    });

    return comment;
  }

  async getCommentsByArticleId(
    articleId: number,
    prisma: Tx = this.prisma,
  ): Promise<CommentWithRelationEntity[]> {
    const where = {
      articleId: articleId,
    };

    const comment = await prisma.comment.findMany({
      where,
      include,
    });

    return comment;
  }

  async deleteCommentById(id: number, prisma: Tx = this.prisma): Promise<void> {
    const where = {
      id,
    };

    await prisma.comment.delete({
      where,
      include,
    });
  }
}
