import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import * as request from 'supertest';

describe('ProjectController (e2e) - create', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  describe('/project (POST)', () => {
    it('should return 401 when create project without credentials', async () => {
      return request(app.getHttpServer())
        .post('/project')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
