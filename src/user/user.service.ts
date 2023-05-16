import { Injectable } from '@nestjs/common';

@Injectable({})
export class UserService {
  async createUsers(): Promise<any> {
    return 'This action adds a new user';
  }
}
