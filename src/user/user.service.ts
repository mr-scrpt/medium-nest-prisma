import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserEntity } from '@app/user/entity/user.entity';
import { UserBuildResponseDto } from '@app/user/dto/userBuildResponse.dto';
import { UserLoginDto } from '@app/user/dto/userLogin.dto';
import { TokenDecode } from '@app/user/type/tokenDecode.interface';
import { UserUpdateDto } from '@app/user/dto/userUpdate.dto';
import { CommonService } from '@app/common/common.service';
import { UserRepository } from '@app/user/user.repository';
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
  async createUser(
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

  async login(userLoginDto: UserLoginDto): Promise<UserBuildResponseDto> {
    const { email, password } = userLoginDto;

    const user = await this.checkAndGetUserByEmail(email);

    await this.checkValidatePassword(password, user.password);

    return this.buildUserResponse(user);
  }

  async getUserCurrent(token: Token): Promise<UserBuildResponseDto> {
    const user = await this.checkAndGetUserByToken(token);

    return this.buildUserResponse(user);
  }

  async getUserByToken(tokenString: string | undefined): Promise<UserEntity> {
    const id = this.getUserIdFromToken(tokenString);

    return await this.checkAndGetUserById(id);
  }

  getUserIdFromToken(tokenString: string): number {
    try {
      const { id } = this.authService.decodeToken(tokenString) as TokenDecode;
      return +id;
    } catch (error) {
      return null;
    }
  }

  private async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  private async checkAndGetUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Email or password are invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return user;
  }

  /***/
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

  private async checkAndGetUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
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

  private checkPasswordData(
    passworLeft: string,
    passwordRight: string,
  ): boolean {
    if ((passworLeft && !passwordRight) || (!passworLeft && passwordRight)) {
      throw new HttpException(
        'Password and passwordOld are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return true;
  }

  /***/
  private async validateAndGenerateHashedPassword(
    passwordNew: string,
    passwordOld: string,
    password: string,
  ): Promise<string> {
    this.checkPasswordData(passwordNew, passwordOld);

    if (!passwordNew && !passwordOld) {
      return '';
    }

    await this.checkValidatePassword(passwordOld, password);

    return await this.authService.hashPassword(passwordNew);
  }

  /***/
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

  /***/
  private validateUpdateUserDto(updateUserDto: UserUpdateDto): void {
    const isNotEmptyObject = this.common.isNotEmptyObject(updateUserDto);
    if (!isNotEmptyObject) {
      throw new HttpException(
        'At least one field must be filled',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  /***/
  private generateStructureUpdateUser(
    userUpdateDto: UserUpdateDto,
  ): UserUpdateDto {
    return Object.fromEntries(
      Object.entries(userUpdateDto).filter(([_, value]) => value !== ''),
    );
  }

  /***/
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
