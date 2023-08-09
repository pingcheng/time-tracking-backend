import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [AuthenticationModule, TaskModule],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
