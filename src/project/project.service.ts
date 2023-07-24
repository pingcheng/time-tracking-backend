import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number) {
    return this.prismaService.project.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
      },
    });
  }
}
