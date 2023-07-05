import { HttpExceptionCustom } from '@app/common/common.exception';
import { HttpStatus } from '@nestjs/common';

export class FollowCheck {
  isFollow(bool: boolean): boolean {
    if (!bool) {
      throw new HttpExceptionCustom(
        'You are not following this user',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isNotFollow(bool: boolean): boolean {
    if (bool) {
      throw new HttpExceptionCustom(
        'You are already following this user',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isNotYourself(bool: boolean): boolean {
    if (bool) {
      throw new HttpExceptionCustom(
        'You can not follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isYourself(bool: boolean): boolean {
    if (bool) {
      throw new HttpExceptionCustom(
        'You can not unfollow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
