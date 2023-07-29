import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from '../fixtures/createTestingApp';
import { testUser1 } from '../fixtures/users';

describe('AuthenticationController (e2e) - login', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  it('/authentication/login (POST) - successful login', async () => {
    return request(app.getHttpServer())
      .post('/authentication/login')
      .send({
        username: testUser1.username,
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
        username: testUser1.username,
        password: 'wrong password',
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
