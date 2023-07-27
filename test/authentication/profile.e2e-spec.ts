import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';

describe('AuthenticationController (e2e) - profile', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    app = await createTestingApp();
    accessToken = await getAccessToken(app, 'user1', 'password');
  });

  it('/authentication/profile (GET) - successful', async () => {
    return request(app.getHttpServer())
      .get('/authentication/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.email).toEqual('user1@sample.com');
        expect(response.body.username).toEqual('user1');
        expect(response.body.name).toEqual('User 1');
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
