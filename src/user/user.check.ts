import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserCheck {
  isExistId(id: number): boolean {
    if (!id) {
      throw new HttpException('User id is not exist', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  isExistUser(user: UserEntity): boolean {
    if (!user) {
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
      throw new HttpException(
        'Password is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return true;
  }

  isExistPassword(passwordLeft: string, passwordRight: string): boolean {
    if ((passwordLeft && !passwordRight) || (!passwordLeft && passwordRight)) {
      throw new HttpException(
        'New password and old password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return true;
  }

  isTokenExist(token: string): boolean {
    if (!token) {
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
