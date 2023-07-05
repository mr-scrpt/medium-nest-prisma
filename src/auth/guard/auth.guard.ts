import {
  CanActivate,
  Inject,
  HttpStatus,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserCheck } from '@app/user/user.check';
import { HttpExceptionCustom } from '@app/common/common.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(UserCheck) private userCheck: UserCheck,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const tokenString = request.headers.authorization;
    console.log('tokenString', tokenString);

    this.userCheck.isTokenExist(!!tokenString);

    try {
      await this.userService.getUserByToken(tokenString);
      return true;
    } catch (error) {
      throw new HttpExceptionCustom(
        'Token expired or incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
