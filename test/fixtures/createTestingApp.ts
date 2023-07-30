import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { ValidationPipe } from '@nestjs/common';

export async function createTestingApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();

  return app;
}
