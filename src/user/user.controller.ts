import { Controller, Get, Headers, Post, Put, UseGuards } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UserRequestCreateDto } from '@app/user/dto/userRequestCreate.dto';
import { ApiBody, ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserBuildResponseDto } from '@app/user/dto/userBuildResponse.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { UserLoginDto } from '@app/user/dto/userLogin.dto';
import { UserRequestLoginDto } from '@app/user/dto/userRequestLogin.dto';
import { AuthGuard } from '@app/user/guard/auth.guard';
import { UserUpdateDto } from '@app/user/dto/userUpdate.dto';
import { UserRequestUpdateDto } from './dto/userRequestUpdate.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @ApiBody({ type: UserRequestCreateDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async createUsers(
    @Body('user') userCreateDto: UserCreateDto,
  ): Promise<UserBuildResponseDto> {
    const createUser = await this.userService.createUsers(userCreateDto);
    return this.userService.buildUserResponse(createUser);
  }

  @Post('users/login')
  @ApiBody({ type: UserRequestLoginDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') userLoginDto: UserLoginDto,
  ): Promise<UserBuildResponseDto> {
    const user = await this.userService.login(userLoginDto);
    return this.userService.buildUserResponse(user);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization: Token jwt.token.here',
  })
  @ApiBody({ type: UserRequestLoginDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async getUser(
    @Headers('Authorization') auth: string | undefined,
  ): Promise<UserBuildResponseDto> {
    const user = await this.userService.getUserByToken(auth);
    return this.userService.buildUserResponse(user);
  }

  @UseGuards(AuthGuard)
  @Put('user')
  @ApiHeader({
    name: 'Authorization',
    description: 'Authorization: Token jwt.token.here',
  })
  @ApiBody({ type: UserRequestUpdateDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Headers('Authorization') auth: string | undefined,
    @Body('user') userUpdateDto: UserUpdateDto,
  ): Promise<UserBuildResponseDto> {
    const { id } = await this.userService.getUserByToken(auth);
    const user = await this.userService.updateUser(id, userUpdateDto);
    // return 'ddd' as any;
    return this.userService.buildUserResponse(user);
  }
}
