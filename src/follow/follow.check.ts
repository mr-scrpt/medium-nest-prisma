import { HttpException, HttpStatus } from '@nestjs/common';

export class FollowCheck {
  isFollow(bool: boolean) {
    if (!bool) {
      throw new HttpException(
        'You are not following this user',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  isNotFollow(bool: boolean) {
    if (bool) {
      throw new HttpException(
        'You are already following this user',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
