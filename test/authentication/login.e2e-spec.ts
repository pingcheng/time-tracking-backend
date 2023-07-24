import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockedUser } from '../fixtures/mockedUsers';
import { createTestingApp } from '../fixtures/createTestingApp';

describe('AuthenticationController (e2e) - login', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    jest.restoreAllMocks();

    app = await createTestingApp();
    prismaService = app.get(PrismaService);

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
