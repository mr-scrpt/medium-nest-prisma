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

  isValidPassword(flag: boolean): boolean {
    if (!flag) {
      throw new HttpException(
        'Password is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
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
}
