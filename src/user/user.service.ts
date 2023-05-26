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
import { UserBuildClearResponseDto } from './dto/userBuildClearResponse.dto';
import { CommonService } from '@app/common/common.service';

@Injectable({})
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private common: CommonService,
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
    const IsNotEmptyObject = this.common.IsNotEmptyObject(updateUserDto);
    if (!IsNotEmptyObject) {
      throw new HttpException(
        'At least one field must be filled',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
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

  // async getUserByToken(tokenString: string | undefined): Promise<UserEntity> {
  //   if (!tokenString) {
  //     throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  //   }
  //   const id = this.getUserIdFromToken(tokenString);
  //   return await this.getUserById(id);
  // }
  async getUserByToken(tokenString: string | undefined): Promise<UserEntity> {
    const id = this.getUserIdFromToken(tokenString);

    return await this.getUserById(id);
    // try {
    //   const id = this.getUserIdFromToken(tokenString);
    //   return await this.getUserById(id);
    // } catch (error) {
    //   throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    // }
  }

  async checkAndGetUserByToken(
    tokenString: string | undefined,
  ): Promise<UserEntity> {
    try {
      const id = this.getUserIdFromToken(tokenString);
      return await this.getUserById(id);
    } catch (error) {
      return null;
    }
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        favorites: true,
      },
    });

    // console.log('User', user);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async addFavoriteById(idUser: number, idArticle: number): Promise<any> {
    const article: any = await this.prisma.article.update({
      where: { id: idArticle },
      data: {
        favoritedBy: {
          connect: { id: idUser },
        },
      },
      include: {
        author: {
          select: {
            email: true,
            username: true,
            bio: true,
            image: true,
          },
        },
        favoritedBy: { select: { id: true } },
      },
    });
    console.dir({ article });
  }

  async getUserIfExistsByToken(
    tokenString: string | undefined,
  ): Promise<UserEntity | null> {
    if (!tokenString) {
      return null;
    }
    const id = this.getUserIdFromToken(tokenString);
    const user = await this.getUserById(id);
    return user;
  }

  async checkUserExistsById(id: number): Promise<boolean> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return !!userExists;
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
    const token = tokenString.split(' ')[1];
    return token;
  }

  private decodeToken(tokenString: string): string | JwtPayload {
    const token = this.getToken(tokenString);

    return this.authService.decodeJWT(token);
  }

  private getUserIdFromToken(tokenString: string): number {
    console.log('tokenString', tokenString);
    const { id } = this.decodeToken(tokenString) as TokenDecode;
    return +id;
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
  buildUserClearResponse(user: UserEntity): UserBuildClearResponseDto {
    const { username, email, bio, image } = user;
    return {
      user: {
        username,
        email,
        bio,
        image,
      },
    };
  }

  // async getUserByTokenWithoutExeption(
  //   tokenString: string | undefined,
  // ): Promise<UserEntity | null> {
  //   if (!tokenString) {
  //     return null;
  //   }
  //   const id = this.getUserIdFromTokenWithoutExeption(tokenString);
  //   if (!id) {
  //     return null;
  //   }
  //   return await this.getUserById(id);
  // }

  // private getUserIdFromTokenWithoutExeption(tokenString: string): number {
  //   const result = this.decodeTokenWithoutExeption(tokenString) as TokenDecode;
  //   if (!result) {
  //     return null;
  //   }
  //   return +result.id;
  //   // return decodedToken['id'];
  // }
  // private decodeTokenWithoutExeption(
  //   tokenString: string,
  // ): string | JwtPayload | null {
  //   const token = this.getTokenWithoutExeption(tokenString);
  //   if (!token) {
  //     console.log('token is null');
  //     return null;
  //   }
  //   console.log('token is not null', token);

  //   return this.authService.decodeJWTWithoutExeption(token);
  // }
  // private getTokenWithoutExeption(tokenString: string): string {
  //   const token = tokenString.split(' ')[1];
  //   if (!token) {
  //     return null;
  //   }
  //   return token;
  // }
}
