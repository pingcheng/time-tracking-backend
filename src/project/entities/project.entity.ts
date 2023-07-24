import { Project } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';

export class ProjectEntity {
  id: number;

  @Exclude()
  userId: number;

  name: string;
  createdAt: string;
  updatedAt: string;

  owner: UserEntity;

  constructor(partial: Partial<ProjectEntity | Project>) {
    Object.assign(this, partial);

    if (partial['owner']) {
      this.owner = new UserEntity(partial['owner']);
    }
  }
}
