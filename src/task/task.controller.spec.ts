import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task.module';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TaskModule, ConfigModule.forRoot({ isGlobal: true })],
      controllers: [TaskController],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
