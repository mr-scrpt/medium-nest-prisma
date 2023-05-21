import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserCreateDto } from './userCreate.dto';

export class UserClearDto extends OmitType(UserCreateDto, ['password']) {
  @ApiProperty({
    example: 'token string',
    description: 'The token of the User',
  })
  @ApiProperty({
    example: 'biography',
    description: 'The biography of the User',
  })
  @IsString()
  bio: string;

  @ApiProperty({
    example: 'image',
    description: 'The image of the User',
  })
  @IsString()
  image: string;
}
