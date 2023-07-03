import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from '@app/comment/comment.service';
import { CommentCreateDto } from '@app/comment/dto/commentCreate.dto';
import { CommentUpdateDto } from '@app/comment/dto/commentUpdate.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() commentCreateDto: CommentCreateDto) {
    return this.commentService.createCommnet(commentCreateDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() commentUpdateDto: CommentUpdateDto) {
    return this.commentService.updateComment(+id, commentUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
