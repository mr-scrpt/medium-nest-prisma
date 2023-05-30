import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
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
import { UserRepository } from './user.repository';
import { Token } from '@app/auth/iterface/auth.interface';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private common: CommonService,
    private userRepository: UserRepository,
    private prisma: PrismaService,
  ) {}
  async createUsers(
    userCreateDto: UserCreateDto,
  ): Promise<UserBuildResponseDto> {
    const { username, email, password } = userCreateDto;

    this.checkUniqueEmailAndName(email, username);

    const passwordHashed = await this.authService.hashPassword(password);

    const data = {
      ...userCreateDto,
      password: passwordHashed,
    };

    const user = await this.userRepository.createUser(data);

    return this.buildUserResponse(user);
  }

  async updateUser(
    updateUserDto: UserUpdateDto,
    token: Token,
  ): Promise<UserBuildResponseDto> {
    const { id, password } = await this.checkAndGetUserByToken(token);

    this.validateUpdateUserDto(updateUserDto);

    const {
      password: passwordNew,
      passwordOld,
      email,
      username,
    } = updateUserDto;

    await this.checkUniqueEmailAndName(email, username);

    const hashPassword = await this.validateAndGenerateHashedPassword(
      passwordNew,
      passwordOld,
      password,
    );

    delete updateUserDto.passwordOld;
    updateUserDto.password = hashPassword;
    const userUpdate = this.generateStructureUpdateUser(updateUserDto);

    const userUpdateResponse = await this.userRepository.updateUser(
      id,
      userUpdate,
    );

    return this.buildUserResponse(userUpdateResponse);
  }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const { email, password } = userLoginDto;

    const user = await this.checkAndGetUserByEmail(email);

    await this.checkValidatePassword(password, user.password);

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async checkAndGetUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Email or password are invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user;
  }

  async getUserByToken(tokenString: string | undefined): Promise<UserEntity> {
    const id = this.getUserIdFromToken(tokenString);

    return await this.getUserById(id);
  }

  private async checkAndGetUserByToken(
    tokenString: string | undefined,
  ): Promise<UserEntity> {
    if (!tokenString) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }
    const userExists = await this.getUserByToken(tokenString);
    if (!userExists) {
      throw new HttpException(
        'User not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return userExists;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // async addFavoriteById(idUser: number, idArticle: number): Promise<any> {
  //   const article: any = await this.prisma.article.update({
  //     where: { id: idArticle },
  //     data: {
  //       favoritedBy: {
  //         connect: { id: idUser },
  //       },
  //     },
  //     include: {
  //       author: {
  //         select: {
  //           email: true,
  //           username: true,
  //           bio: true,
  //           image: true,
  //         },
  //       },
  //       favoritedBy: { select: { id: true } },
  //     },
  //   });
  //   console.dir({ article });
  // }

  // async getUserIfExistsByToken(
  //   tokenString: string | undefined,
  // ): Promise<UserEntity | null> {
  //   if (!tokenString) {
  //     return null;
  //   }
  //   const id = this.getUserIdFromToken(tokenString);
  //   const user = await this.getUserById(id);
  //   return user;
  // }

  // async checkUserExistsById(id: number): Promise<boolean> {
  //   const userExists = await this.prisma.user.findUnique({
  //     where: {
  //       id,
  //     },
  //   });

  //   return !!userExists;
  // }

  private validateUpdateUserDto(updateUserDto: UserUpdateDto): void {
    const isNotEmptyObject = this.common.isNotEmptyObject(updateUserDto);
    if (!isNotEmptyObject) {
      throw new HttpException(
        'At least one field must be filled',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  private async checkValidatePassword(
    passwordLeft: string,
    passwordRight: string,
  ): Promise<void> {
    const isValid = await this.authService.validatePassword(
      passwordLeft,
      passwordRight,
    );

    if (!isValid) {
      throw new HttpException(
        'Password is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  private async validateAndGenerateHashedPassword(
    passwordNew: string,
    passwordOld: string,
    password: string,
  ): Promise<string> {
    if ((passwordNew && !passwordOld) || (!passwordNew && passwordOld)) {
      throw new HttpException(
        'Password and passwordOld are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!passwordNew && !passwordOld) {
      return '';
    }

    await this.checkValidatePassword(passwordOld, password);

    return await this.authService.hashPassword(passwordNew);
  }

  // private async validatePassword(
  //   passwordNew: string,
  //   passwordOld: string,
  //   password: string,
  // ): Promise<void> {
  //   if (passwordNew && passwordOld) {
  //     const passwordValid = await this.authService.validatePassword(
  //       passwordOld,
  //       password,
  //     );

  //     if (!passwordValid) {
  //       throw new HttpException(
  //         'Password is invalid',
  //         HttpStatus.UNPROCESSABLE_ENTITY,
  //       );
  //     }
  //   }
  // }

  private async checkUniqueEmailAndName(
    email: string,
    username: string,
  ): Promise<void> {
    const userExists = await this.userRepository.checkEmailAndName(
      email,
      username,
    );
    if (userExists) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // private async checkAndGetUserById(id: number): Promise<UserEntity> {
  //   const userExists = await this.userRepository.getUserById(id);
  //   if (!userExists) {
  //     throw new HttpException(
  //       'User not found',
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }
  //   return userExists;
  // }

  private getToken(tokenString: string): string {
    const token = tokenString.split(' ')[1];
    return token;
  }

  private decodeToken(tokenString: string): string | JwtPayload {
    const token = this.getToken(tokenString);

    return this.authService.decodeJWT(token);
  }

  private generateStructureUpdateUser(
    userUpdateDto: UserUpdateDto,
  ): UserUpdateDto {
    return Object.fromEntries(
      Object.entries(userUpdateDto).filter(([_, value]) => value !== ''),
    );
    // const dataUpdate = { ...userUpdateDto };
    // for (const key in dataUpdate) {
    //   if (!dataUpdate[key]) {
    //     delete dataUpdate[key];
    //   }
    // }
    // return dataUpdate;
  }

  private async generateUserWithHashedPassword(
    userUpdateDto: UserUpdateDto,
    passwordNew: string,
  ): Promise<UserUpdateDto> {
    const passwordHashed = await this.authService.hashPassword(passwordNew);
    userUpdateDto.password = passwordHashed;
    delete userUpdateDto.passwordOld;

    return userUpdateDto;
  }

  getUserIdFromToken(tokenString: string): number {
    try {
      const { id } = this.decodeToken(tokenString) as TokenDecode;
      return +id;
    } catch (error) {
      return null;
    }
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
