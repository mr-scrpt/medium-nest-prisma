import { Injectable } from '@nestjs/common';
import { CommentCreateDto } from '@app/comment/dto/commentCreate.dto';
import { CommentRepository } from './comment.repository';
import { CommentToDBDto } from './dto/db/commentToDB.dto';
import { ResCommentDto } from './dto/resComment.dto';
import { CommentFullDataSerializedDto } from './dto/commentFullDataSerialized.dto';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}
  async createComment(
    commentCreateDto: CommentCreateDto,
    authorId: number,
    articleId: number,
  ): Promise<ResCommentDto> {
    const commentToDB = this.prepareToCreateComment(
      commentCreateDto,
      authorId,
      articleId,
    );

    const comment = await this.commentRepository.createComment(commentToDB);
    console.log('after create comment');
    console.log('comment', comment);
    if (!comment) {
      throw new Error('Comment not created');
    }
    console.log('id', comment.id);
    const data = await this.commentRepository.getCommentById(comment.id);

    return this.buildCommentResponse(data);
  }

  private prepareToCreateComment(
    commentCreateDto: CommentCreateDto,
    authorId: number,
    articleId: number,
  ): CommentToDBDto {
    return {
      ...commentCreateDto,
      authorId,
      articleId,
    };
  }
  private buildCommentResponse(
    data: CommentFullDataSerializedDto,
  ): ResCommentDto {
    return {
      comment: {
        ...data,
      },
    };
  }
}
