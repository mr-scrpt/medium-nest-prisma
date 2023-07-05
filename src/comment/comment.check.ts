import { HttpExceptionCustom } from '@app/common/common.exception';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CommentCheck {
  isExist(bool: boolean): boolean {
    if (!bool) {
      throw new HttpExceptionCustom('Comment not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  isAuthor(bool: boolean): boolean {
    if (!bool) {
      throw new HttpExceptionCustom(
        'You are not the author of this comment',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
