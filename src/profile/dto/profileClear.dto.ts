import { UserClearDto } from '@app/user/dto/userClear.dto';
import { OmitType } from '@nestjs/swagger';

export class ProfileClearDto extends OmitType(UserClearDto, ['email']) {}
