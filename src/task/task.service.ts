import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
