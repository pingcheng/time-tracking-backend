import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import {
  getTaskById,
  getUserByUsername,
  listTasksByUserId,
} from '../fixtures/query';
import * as request from 'supertest';
import { createTask } from '../fixtures/createTask';

describe('TaskController (e2e) - delete', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  describe('/task/:id (DELETE)', () => {
    it('should return 401 when not authenticated', async () => {
      const user = await getUserByUsername(testUser1.username);
      const tasks = await listTasksByUserId(user.id);
      const task = tasks[0];

      return request(app.getHttpServer())
        .delete(`/task/${task.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 200 when deleted the task correctly', async () => {
      const taskId = await createTask(app, accessToken, {
        name: 'Test',
      });

      return request(app.getHttpServer())
        .delete(`/task/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .then(async () => {
          const task = await getTaskById(taskId);
          expect(task).toBeNull();
        });
    });
  });
});
