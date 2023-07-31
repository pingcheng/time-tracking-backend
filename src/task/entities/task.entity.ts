import { Exclude } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
import { Task } from '@prisma/client';

export class TaskEntity {
  id: number;

  @Exclude()
  userId: number;

  @Exclude()
  projectId?: number;

  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  owner: UserEntity;
  project: ProjectEntity | null = null;

  constructor(partial: Partial<TaskEntity | Task>) {
    Object.assign(this, partial);

    if (partial['owner']) {
      this.owner = new UserEntity(partial['owner']);
    }

    if (partial['project']) {
      this.project = new ProjectEntity(partial['project']);
    }
  }
}
