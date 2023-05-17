import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UserCreateDto, UserDto } from '@app/user/dto/userCreate.dto';
import { ApiBody } from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @ApiBody({ type: UserCreateDto })
  async createUsers(@Body('user') userDto: UserDto): Promise<any> {
    await this.userService.createUsers(userDto);
    return '';
  }
}
