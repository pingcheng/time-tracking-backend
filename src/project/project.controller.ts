import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth } from '../authentication/decorators/auth.decorator';
import { JwtAuthPayload } from '../authentication/authentication.type';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { ProjectEntity } from './entities/project.entity';
import { inRange } from '../utils/inRange';

@Controller('project')
export class ProjectController {
  static readonly MAX_TAKE = 50;

  private readonly logger: Logger;

  constructor(private readonly projectService: ProjectService) {
    this.logger = new Logger(ProjectController.name);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @Auth() auth: JwtAuthPayload,
  ) {
    const project = await this.projectService.findById(id);

    if (!project) {
      throw new NotFoundException();
    }

    // check owner
    if (project.owner.id !== auth.sub) {
      throw new NotFoundException();
    }

    return new ProjectEntity(project);
  }

  @Get('/')
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async listOwned(
    @Auth() auth: JwtAuthPayload,
    @Query('take', new ParseIntPipe({ optional: true })) take = 10,
    @Query('skip', new ParseIntPipe({ optional: true })) skip = 0,
  ) {
    const filteredTake = inRange(take, 0, ProjectController.MAX_TAKE);
    const filteredSkip = inRange(skip, 0, Number.MAX_SAFE_INTEGER);

    const projects = await this.projectService.queryByUser(auth.sub, {
      pagination: {
        take: filteredTake,
        skip: filteredSkip,
      },
    });
    return projects.map((project) => new ProjectEntity(project));
  }
}
