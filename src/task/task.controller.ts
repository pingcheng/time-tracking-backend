import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { TaskService } from './task.service';
import { Principal } from '../authentication/decorators/principal.decorator';
import { User } from '@prisma/client';
import { TaskEntity } from './entities/task.entity';

@Controller('task')
export class TaskController {
  private readonly logger: Logger;

  constructor(private readonly taskService: TaskService) {
    this.logger = new Logger(TaskController.name);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Principal() user: User,
  ) {
    const task = await this.taskService.findById(id);

    if (!task) {
      throw new NotFoundException();
    }

    if (task.owner.id !== user.id) {
      throw new NotFoundException();
    }

    return new TaskEntity(task);
  }
}
