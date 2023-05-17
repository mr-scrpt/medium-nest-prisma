import { UserEntity } from '../entity/user.entity';

export interface UserInterface extends Omit<UserEntity, 'password'> {
  token: string;
}
export interface UserResponseInterface {
  usder: UserInterface;
}
