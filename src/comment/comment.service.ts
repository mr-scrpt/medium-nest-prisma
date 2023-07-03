import { Injectable } from '@nestjs/common';
import { CommentCreateDto } from '@app/comment/dto/commentCreate.dto';
import { CommentUpdateDto } from '@app/comment/dto/commentUpdate.dto';

@Injectable()
export class CommentService {
  createCommnet(commentCreateDto: CommentCreateDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  updateComment(id: number, commentUpdateDto: CommentUpdateDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
