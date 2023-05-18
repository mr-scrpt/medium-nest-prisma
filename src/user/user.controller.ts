import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UserRequestCreateDto } from '@app/user/dto/userRequestCreate.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserBuildResponseDto } from './dto/userBuildResponse.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

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
    const user = this.userService.buildUserResponse(createUser);
    return user;
  }
}
