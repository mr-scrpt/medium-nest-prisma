import {
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRequestCreateDto } from '@app/user/dto/userRequestCreate.dto';
import {
  ApiBody,
  ApiTags,
  ApiCreatedResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { UserCreateDto } from '@app/user/dto/userCreate.dto';
import { UserBuildResponseDto } from '@app/user/dto/userBuildResponse.dto';
import { UserLoginDto } from '@app/user/dto/userLogin.dto';
import { UserRequestLoginDto } from '@app/user/dto/userRequestLogin.dto';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { UserUpdateDto } from '@app/user/dto/userUpdate.dto';
import { UserRequestUpdateDto } from './dto/userRequestUpdate.dto';
import { Token } from '@app/auth/iterface/auth.interface';

@ApiTags('user')
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
    return await this.userService.createUser(userCreateDto);
  }

  @Post('users/login')
  @ApiBody({ type: UserRequestLoginDto })
  @ApiCreatedResponse({ type: UserBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') userLoginDto: UserLoginDto,
  ): Promise<UserBuildResponseDto> {
    return await this.userService.login(userLoginDto);
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
  async getUserCurrent(
    @Headers('Authorization') auth: Token,
  ): Promise<UserBuildResponseDto> {
    return await this.userService.getUserCurrent(auth);
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
  async updateCurrentUser(
    @Headers('Authorization') auth: Token,
    @Body('user') userUpdateDto: UserUpdateDto,
  ): Promise<UserBuildResponseDto> {
    return await this.userService.updateUser(userUpdateDto, auth);
  }
}
