import { OmitType } from '@nestjs/swagger';
import { UserCreateDto } from './userCreate.dto';
export class UserLoginDto extends OmitType(UserCreateDto, ['username']) {}
