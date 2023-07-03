import { HttpException, HttpStatus } from '@nestjs/common';

export class FollowCheck {
  isFollow(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException(
        'You are not following this user',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isNotFollow(bool: boolean): boolean {
    if (bool) {
      throw new HttpException(
        'You are already following this user',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isNotYourself(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException(
        'You can not follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }
}
