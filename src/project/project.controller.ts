import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth } from '../authentication/decorators/auth.decorator';
import { JwtAuthPayload } from '../authentication/authentication.type';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { ProjectEntity } from './entities/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
}
