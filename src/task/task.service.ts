import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './task.type';
import { PaginationOptions } from '../project/project.service';

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

  async list({
    userId,
    projectId,
    pagination: { skip, take } = {
      skip: undefined,
      take: 10,
    },
  }: ListOptions) {
    return this.prismaService.task.findMany({
      where: {
        userId,
        projectId,
      },
      skip,
      take,
      orderBy: {
        id: 'desc',
      },
      include: {
        project: true,
        owner: true,
      },
    });
  }

  async delete(id: number) {
    return this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }
}

export type ListOptions = {
  userId?: number;
  projectId?: number;
  pagination?: PaginationOptions;
};
