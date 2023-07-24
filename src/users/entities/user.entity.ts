import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';

export class UserEntity {
  id: number;
  email: string;
  username: string;
  name: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  constructor(partial: Partial<UserEntity | User>) {
    Object.assign(this, partial);
  }
}
