import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { TaskService } from './task.service';
import { Principal } from '../authentication/decorators/principal.decorator';
import { User } from '@prisma/client';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './validators/CreateTaskDto';

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

  @Post('/')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Principal() user: User, @Body() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.create({
      userId: user.id,
      name: createTaskDto.name,
      description: createTaskDto.description,
    });

    return new TaskEntity(task);
  }

  @Get('/')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async list(@Principal() { id: userId }: User) {
    const tasks = await this.taskService.list({
      userId,
    });

    return tasks.map((task) => new TaskEntity(task));
  }

  @Delete('/:id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Principal() user: User, @Param('id', ParseIntPipe) id: number) {
    const task = await this.taskService.findById(id);

    if (!task) throw new NotFoundException();
    if (task.owner.id !== user.id) throw new NotFoundException();

    await this.taskService.delete(id);

    return new TaskEntity(task);
  }
}
