import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockedPrismaServiceFactory } from './mockedPrismaServiceFactory';

export async function createTestingApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useFactory(mockedPrismaServiceFactory)
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}
