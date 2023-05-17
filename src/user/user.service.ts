import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserDto } from '@app/user/dto/userCreate.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthService } from '@app/auth/auth.service';

@Injectable({})
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}
  async createUsers(userDto: UserDto): Promise<any> {
    const { email, password } = userDto;
    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const passwordHashed = await this.authService.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        ...userDto,
        password: passwordHashed,
      },
    });
  }
}
