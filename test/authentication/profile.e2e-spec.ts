import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import { getUserByUsername } from '../fixtures/query';

describe('AuthenticationController (e2e) - profile', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  it('/authentication/profile (GET) - successful', async () => {
    const user = await getUserByUsername(testUser1.username);

    return request(app.getHttpServer())
      .get('/authentication/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toEqual(user.id);
        expect(response.body.email).toEqual(user.email);
        expect(response.body.username).toEqual(user.username);
        expect(response.body.name).toEqual(user.name);
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
