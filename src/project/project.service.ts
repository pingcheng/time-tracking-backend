import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  private logger: Logger;

  constructor(private readonly prismaService: PrismaService) {
    this.logger = new Logger(ProjectService.name);
  }

  async findById(id: number) {
    const project = await this.prismaService.project.findUnique({
      where: {
        id,
      },
      include: {
        owner: true,
      },
    });

    if (project && !project.owner) {
      this.logger.error(
        `Trying to load project (${id}), but failed to load its owner data by user id (${project.userId})`,
      );
      throw new InternalServerErrorException();
    }

    return project;
  }

  async queryByUser(userId: number, options?: QueryByUserOptions) {
    return this.prismaService.project.findMany({
      where: {
        userId,
      },
      skip: options?.pagination?.skip,
      take: options?.pagination?.take ?? 10,
      orderBy: {
        id: 'desc',
      },
    });
  }
}

export type QueryByUserOptions = {
  pagination?: PaginationOptions;
};

export type PaginationOptions = {
  take: number;
  skip?: number;
};
