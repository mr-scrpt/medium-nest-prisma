import { CommentCreateDto } from '@app/comment/dto/commentCreate.dto';
import { Tx } from '@app/common/common.type';
import { PrismaService } from '@app/prisma/prisma.service';
import { CommentEntity } from '@app/comment/entity/comment.entity';
import { CommentWithRelationEntity } from './entity/commentWithRelation.entity';

export class CommentRepository {
  constructor(private prisma: PrismaService) {}
  createComment(
    articleCreateDto: CommentCreateDto,
    articleId: number,
    authorId: number,
    prisma: Tx = this.prisma,
  ): Promise<CommentEntity> {
    return prisma.comment.create({
      data: {
        ...articleCreateDto,
        articleId,
        authorId,
      },
    });
  }

  async getCommentsByArticleId(
    articleId: number,
    prisma: Tx = this.prisma,
  ): Promise<CommentWithRelationEntity[]> {
    const where = {
      articleId: articleId,
    };
    const include = {
      author: true,
    };

    const comment = await prisma.comment.findMany({
      where,
      include,
    });

    return comment;
  }
}
