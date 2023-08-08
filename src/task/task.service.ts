import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './task.type';

@Injectable()
export class TaskService {
  private logger: Logger;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(TaskService.name);
  }

  async findById(id: number) {
    return this.prismaService.task.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
        project: true,
      },
    });
  }

  async create(dto: CreateTaskDto) {
    return this.prismaService.task.create({
      data: {
        name: dto.name,
        description: dto.description,
        userId: dto.userId,
        projectId: dto.projectId,
      },
      include: {
        owner: true,
        project: true,
      },
    });
  }
}
