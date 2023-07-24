import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project.module';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProjectModule, ConfigModule.forRoot({ isGlobal: true })],
      controllers: [ProjectController],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
