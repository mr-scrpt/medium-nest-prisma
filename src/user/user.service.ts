import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthService } from '@app/auth/auth.service';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserEntity } from './entity/user.entity';
import { UserBuildResponseDto } from '@app/user/dto/userBuildResponse.dto';

@Injectable({})
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}
  async createUsers(userCreateDto: UserCreateDto): Promise<UserEntity> {
    const { email, password } = userCreateDto;
    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const passwordHashed = await this.authService.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        ...userCreateDto,
        password: passwordHashed,
      },
    });
  }

  buildUserResponse(userDto: UserEntity): UserBuildResponseDto {
    const { id, username, email, bio, image } = userDto;
    const token = this.authService.generateJWT(id.toString());
    return {
      user: {
        username,
        email,
        bio,
        image,
        token,
      },
    };
  }
}
