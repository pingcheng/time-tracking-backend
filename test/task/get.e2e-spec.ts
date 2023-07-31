import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import { getUserByUsername, listTasksByUserId } from '../fixtures/query';
import * as request from 'supertest';

describe('TaskController (e2e) - get', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  describe('/task/:id (GET)', () => {
    it('should return 401 when not authenticated', async () => {
      const user = await getUserByUsername(testUser1.username);
      const tasks = await listTasksByUserId(user.id);
      const task = tasks[0];

      return request(app.getHttpServer())
        .get(`/task/${task.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
