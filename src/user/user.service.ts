import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthService } from '@app/auth/auth.service';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserEntity } from '@app/user/entity/user.entity';
import { UserBuildResponseDto } from '@app/user/dto/userBuildResponse.dto';
import { UserLoginDto } from '@app/user/dto/userLogin.dto';
import { JwtPayload } from 'jsonwebtoken';
import { TokenDecode } from '@app/user/type/tokenDecode.interface';
import { UserUpdateDto } from '@app/user/dto/userUpdate.dto';

@Injectable({})
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}
  async createUsers(userCreateDto: UserCreateDto): Promise<UserEntity> {
    const { username, email, password } = userCreateDto;

    const userExists = await this.checkUserExists(email, username);
    if (userExists) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const passwordHashed = await this.authService.hashPassword(password);

    return await this.prisma.user.create({
      data: {
        ...userCreateDto,
        password: passwordHashed,
      },
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UserUpdateDto,
  ): Promise<UserEntity> {
    const { password, passwordOld, email, username } = updateUserDto;

    if ((password && !passwordOld) || (!password && passwordOld)) {
      throw new HttpException(
        'Password and passwordOld are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userExists = await this.checkUserExists(email, username);
    if (userExists) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const dataUpdate = { ...updateUserDto };

    for (const key in dataUpdate) {
      if (!dataUpdate[key]) {
        delete dataUpdate[key];
      }
    }

    if (password && passwordOld) {
      const user = await this.getUserById(id);
      if (!user) {
        throw new HttpException(
          'User not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const passwordValid = await this.authService.validatePassword(
        passwordOld,
        user.password,
      );

      if (!passwordValid) {
        throw new HttpException(
          'Password is invalid',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      const passwordHashed = await this.authService.hashPassword(password);
      dataUpdate.password = passwordHashed;
      delete dataUpdate.passwordOld;
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...dataUpdate,
      },
    });
    // return '' as any;
  }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const { email, password } = userLoginDto;

    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Email or password are invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const passwordValid = await this.authService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new HttpException(
        'Email or password are invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserByToken(tokenString: string | undefined): Promise<UserEntity> {
    if (!tokenString) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
    const id = this.getUserIdFromToken(tokenString);
    return await this.getUserById(id);
  }

  private async checkUserExists(
    email: string,
    username: string,
  ): Promise<boolean> {
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    return !!userExists;
  }

  private getToken(tokenString: string): string {
    return tokenString.split(' ')[1];
  }

  private decodeToken(tokenString: string): string | JwtPayload {
    const token = this.getToken(tokenString);
    return this.authService.decodeJWT(token);
  }

  private getUserIdFromToken(tokenString: string): number {
    const { id } = this.decodeToken(tokenString) as TokenDecode;
    return +id;
    // return decodedToken['id'];
  }

  private async getUserById(id: number): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  buildUserResponse(user: UserEntity): UserBuildResponseDto {
    const { id, username, email, bio, image } = user;
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
