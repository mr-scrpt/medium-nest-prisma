import { Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
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
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async getUser(
    @Headers('Authorization') auth: string | undefined,
  ): Promise<UserBuildResponseDto> {
    const user = await this.userService.getUserByToken(auth);
    return this.userService.buildUserResponse(user);
  }
}
