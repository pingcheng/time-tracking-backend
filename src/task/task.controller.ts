import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../authentication/authentication.guard';

@Controller('task')
export class TaskController {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(TaskController.name);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async getById() {
    return undefined;
  }
}
