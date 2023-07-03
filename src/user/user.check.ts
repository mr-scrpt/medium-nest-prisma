import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserCheck {
  isExistUser(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }

  isUniqueUser(bool: boolean): boolean {
    if (bool) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return true;
  }

  isValidPassword(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException('Password is invalid', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  isNotExistBothPassword(bool: boolean): boolean {
    if (bool) {
      throw new HttpException(
        'New password and old password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isTokenExist(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  isNotEmptyUpdate(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException(
        'At least one field must be filled',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return true;
  }
}
