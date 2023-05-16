import { Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiCreatedResponse({ type: '' })
  @Post('users')
  async createUsers(): Promise<any> {
    return this.userService.createUsers();
  }
}
