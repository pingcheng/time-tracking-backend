import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockedUser } from '../fixtures/mockedUsers';

describe('AuthenticationController (e2e) - login', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);
    await app.init();

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockedUser);
  });

  it('/authentication/login (POST) - successful login', async () => {
    return request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        username: mockedUser.username,
        password: 'password',
      })
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body.access_token).toEqual(expect.any(String));
      });
  });

  it('/authentication/login (POST) - failed login', async () => {
    return request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        username: mockedUser.username,
        password: 'wrong password',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
