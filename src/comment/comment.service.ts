import { Injectable } from '@nestjs/common';
import { CommentCreateDto } from '@app/comment/dto/commentCreate.dto';
import { CommentRepository } from './comment.repository';
import { CommentToDBDto } from './dto/db/commentToDB.dto';
import { ResCommentDto } from './dto/resComment.dto';
import { CommentFullDataSerializedDto } from './dto/commentFullDataSerialized.dto';
import { ResCommentListDto } from './dto/resCommentList.dto';
import { CommentCheck } from './comment.check';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private readonly commentCheck: CommentCheck,
  ) {}

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
    const data = await this.commentRepository.getCommentById(comment.id);

    return this.buildCommentResponse(data);
  }

  async getCommentListByArticleId(
    articleId: number,
  ): Promise<ResCommentListDto> {
    const comments = await this.commentRepository.getCommentsByArticleId(
      articleId,
    );

    return this.buildCommentListResponse(comments);
  }

  async deleteCommentById(commentId: number, userId: number): Promise<void> {
    console.log('commentId', commentId);
    await this.checkExistComment(commentId);
    const comment = await this.commentRepository.getCommentById(commentId);
    await this.checkIsAuthor(comment.authorId, userId);

    await this.commentRepository.deleteCommentById(commentId);
  }

  private async checkIsAuthor(authorId: number, userId: number): Promise<void> {
    const isAuthor = authorId === userId;
    this.commentCheck.isAuthor(!!isAuthor);
  }

  private async checkExistComment(commentId: number): Promise<void> {
    const comment = await this.commentRepository.getCommentById(commentId);
    this.commentCheck.isExist(!!comment);
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

  private buildCommentListResponse(
    comments: CommentFullDataSerializedDto[],
  ): ResCommentListDto {
    return {
      comments,
    };
  }
}
