import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CommentCheck {
  isExist(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  isAuthor(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException(
        'You are not the author of this comment',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
