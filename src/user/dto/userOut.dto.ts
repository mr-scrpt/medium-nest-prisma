import { OmitType } from '@nestjs/swagger';
import { UserClearDto } from '@app/user/dto/userClear.dto';

export class UserOutDto extends OmitType(UserClearDto, ['token']) {}
