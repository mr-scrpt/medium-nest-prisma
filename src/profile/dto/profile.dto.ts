import { UserClearDto } from '@app/user/dto/userClear.dto';
import { UserEntity } from '@app/user/entity/user.entity';
import { OmitType } from '@nestjs/swagger';

export class ProfileDto extends OmitType(UserEntity, ['email']) {}
