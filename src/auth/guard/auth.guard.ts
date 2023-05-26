import {
  CanActivate,
  Inject,
  HttpStatus,
  HttpException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(UserService) private userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const tokenString = request.headers.authorization;

    if (!tokenString) {
      // return false;
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
    console.log('tokenString before', tokenString);

    try {
      await this.userService.getUserByToken(tokenString);
      return true;
    } catch (error) {
      throw new HttpException(
        'Token expired or incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
