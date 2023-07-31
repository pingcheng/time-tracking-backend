import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1, testUser2 } from '../fixtures/users';
import { getUserByUsername, listTasksByUserId } from '../fixtures/query';
import * as request from 'supertest';
import { taskSchema } from '../fixtures/schema/schema';

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
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toMatchSchema(taskSchema);
        });
    });

    it('should return 401 when not authenticated', async () => {
      const user = await getUserByUsername(testUser1.username);
      const tasks = await listTasksByUserId(user.id);
      const task = tasks[0];

      return request(app.getHttpServer())
        .get(`/task/${task.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 when id is not found', async () => {
      return request(app.getHttpServer())
        .get(`/task/99999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 when task is not belong to current user', async () => {
      const anotherUser = await getUserByUsername(testUser2.username);
      const tasks = await listTasksByUserId(anotherUser.id);
      const task = tasks[0];

      return request(app.getHttpServer())
        .get(`/task/${task.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
