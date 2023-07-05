import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserEntity } from '@app/user/entity/user.entity';
import { ResUserDto } from '@app/user/dto/resUser.dto';
import { UserLoginDto } from '@app/user/dto/userLogin.dto';
import { TokenDecode } from '@app/user/type/tokenDecode.interface';
import { UserUpdateDto } from '@app/user/dto/userUpdate.dto';
import { CommonService } from '@app/common/common.service';
import { UserRepository } from '@app/user/user.repository';
import { Token } from '@app/auth/iterface/auth.interface';
import { UserCheck } from '@app/user/user.check';
import { ResUserWithTokenDto } from './dto/resUserWithToken.dto';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    private commonService: CommonService,
    private userRepository: UserRepository,
    private userCheck: UserCheck,
  ) {}

  async login({ email, password }: UserLoginDto): Promise<ResUserDto> {
    const user = await this.checkLoginData(email, password);
    console.log(user);
    return this.buildUserResponseWithToken(user);
  }

  async getUserCurrent(token: Token): Promise<ResUserDto> {
    const user = await this.getUserByToken(token);

    return this.buildUserResponse(user);
  }

  async createUser(userCreateDto: UserCreateDto): Promise<ResUserDto> {
    console.log(userCreateDto);
    const userClean = this.prepareUserCreateObject(userCreateDto);
    const { email, username } = userCreateDto;
    await this.checkUniqueUser(email, username);

    console.log(userClean);

    const passwordHashed = await this.authService.hashPassword(
      userClean.password,
    );

    const data = {
      ...userClean,
      password: passwordHashed,
    };

    const user = await this.userRepository.createUser(data);

    return this.buildUserResponse(user);
  }

  async updateUser(
    userUpdateDto: UserUpdateDto,
    token: Token,
  ): Promise<ResUserDto> {
    const userClean = this.prepareUserUpdateObject(userUpdateDto);
    const { id, password } = await this.getUserByToken(token);

    this.validateUpdateUserDto(userClean);

    const { password: passwordNew, passwordOld, email, username } = userClean;

    await this.checkUniqueUser(email, username);

    await this.validatePassword(passwordNew, passwordOld, password);

    const passwordHashed = await this.generatePassword(passwordNew);

    const data = this.generateStructureUpdateUser(userClean, passwordHashed);

    const user = await this.userRepository.updateUser(id, data);

    return this.buildUserResponse(user);
  }

  async checkUserByName(username: string): Promise<boolean> {
    const user = await this.userRepository.getUserByName(username);

    this.userCheck.isExistUser(!!user);

    return true;
  }

  async getUserByName(username: string): Promise<UserEntity> {
    return await this.userRepository.getUserByName(username);
  }

  getUserIdFromToken(tokenString: string): number {
    // Не выкидываем искючение, потому что есть случаи когда токен не нужен
    try {
      const { id } = this.authService.decodeToken(tokenString) as TokenDecode;
      return +id;
    } catch (error) {
      return null;
    }
  }

  async getUserByToken(tokenString: Token): Promise<UserEntity> {
    const id = this.getUserIdFromToken(tokenString);
    await this.checkUserById(id);

    return await this.getUserById(id);
  }

  private async checkLoginData(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    // Перехватываем ошибки о которых пользователю не нужно знать и даем общую ошибку
    try {
      await this.checkEmailExist(email);

      const user = await this.userRepository.getUserByEmail(email);

      await this.checkValidatePassword(password, user.password);

      return user;
    } catch (e) {
      throw new HttpException(
        'login or password incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async checkEmailExist(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
    this.userCheck.isExistUser(!!user);
  }

  private async checkUserById(id: number): Promise<void> {
    const user = await this.userRepository.getUserById(id);
    this.userCheck.isExistUser(!!user);
  }

  private getUserById(id: number): Promise<UserEntity> {
    return this.userRepository.getUserById(id);
  }

  private async validatePassword(
    passwordNew: string,
    passwordOld: string,
    password: string,
  ): Promise<void> {
    this.checkPasswordData(passwordNew, passwordOld);

    if (!passwordNew && !passwordOld) {
      return;
    }

    await this.checkValidatePassword(passwordOld, password);
  }

  private async generatePassword(password: string): Promise<string> {
    if (!password) {
      return '';
    }
    return await this.authService.hashPassword(password);
  }

  private checkPasswordData(
    passwordLeft: string,
    passwordRight: string,
  ): boolean {
    const bool =
      (passwordLeft && !passwordRight) || (!passwordLeft && passwordRight);

    return this.userCheck.isNotExistBothPassword(!!bool);
  }

  private async checkValidatePassword(
    passwordLeft: string,
    passwordRight: string,
  ): Promise<void> {
    let isValid: boolean;

    if (!passwordLeft && !passwordRight) {
      isValid = false;
    }
    isValid = await this.authService.validatePassword(
      passwordLeft,
      passwordRight,
    );

    this.userCheck.isValidPassword(isValid);
  }

  private async checkUniqueUser(
    email: string,
    username: string,
  ): Promise<void> {
    const userExists = await this.userRepository.getUserByEmailOrName(
      email,
      username,
    );

    this.userCheck.isUniqueUser(!!userExists);
  }

  private validateUpdateUserDto(updateUserDto: UserUpdateDto): void {
    const isNotEmptyObject = this.commonService.isNotEmptyObject(updateUserDto);
    this.userCheck.isNotEmptyUpdate(isNotEmptyObject);
  }

  private generateStructureUpdateUser(
    userUpdateDto: UserUpdateDto,
    passwordHashed: string,
  ): UserUpdateDto {
    const user = { ...userUpdateDto };
    delete user.passwordOld;
    user.password = passwordHashed;
    return Object.fromEntries(
      Object.entries(user).filter(([_, value]) => value !== ''),
    );
  }

  private prepareUserCreateObject(userUpdateDto: UserCreateDto): UserCreateDto {
    const { username, email, password } = userUpdateDto;

    return { username, email, password };
  }
  private prepareUserUpdateObject(userUpdateDto: UserUpdateDto): UserUpdateDto {
    const { username, email, password, passwordOld, bio, image } =
      userUpdateDto;

    return { username, email, password, passwordOld, bio, image };
  }

  private buildUserResponseWithToken(user: UserEntity): ResUserWithTokenDto {
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

  private buildUserResponse(user: UserEntity): ResUserDto {
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
}
