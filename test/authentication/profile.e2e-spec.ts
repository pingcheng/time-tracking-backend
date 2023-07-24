import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { mockedUser } from '../fixtures/mockedUsers';
import * as request from 'supertest';

describe('AuthenticationController (e2e) - profile', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);
    await app.init();

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockedUser);

    const response = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        username: mockedUser.username,
        password: 'password',
      });
    accessToken = response.body.access_token;
  });

  it('/authentication/profile (GET) - successful', async () => {
    return request(app.getHttpServer())
      .get('/authentication/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toEqual(mockedUser.id);
        expect(response.body.email).toEqual(mockedUser.email);
        expect(response.body.username).toEqual(mockedUser.username);
        expect(response.body.name).toEqual(mockedUser.name);
        expect(response.body).not.toHaveProperty('password');
      });
  });

  it('/authentication/profile (GET) - 401 when no token', async () => {
    return request(app.getHttpServer())
      .get('/authentication/profile')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/authentication/profile (GET) - 401 when wrong token', async () => {
    return request(app.getHttpServer())
      .get('/authentication/profile')
      .set('Authorization', `Bearer wrong-token`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
