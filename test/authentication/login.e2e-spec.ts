import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { mockedUser, mockedUserPassword } from '../fixtures/mockedUsers';
import { createTestingApp } from '../fixtures/createTestingApp';

describe('AuthenticationController (e2e) - login', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  it('/authentication/login (POST) - successful login', async () => {
    return request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        username: mockedUser.username,
        password: mockedUserPassword,
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
