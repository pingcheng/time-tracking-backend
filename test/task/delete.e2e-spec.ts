import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1, testUser2 } from '../fixtures/users';
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

    it('should return 404 when delete a task is not found', async () => {
      return request(app.getHttpServer())
        .delete(`/task/9999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 when delete a task belongs to other users', async () => {
      const user2Token = await getAccessToken(
        app,
        testUser2.username,
        'password',
      );
      const taskId = await createTask(app, user2Token, {
        name: 'Test 2',
      });

      return request(app.getHttpServer())
        .delete(`/task/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND)
        .then(async () => {
          const task = await getTaskById(taskId);
          expect(task).toBeDefined();
        });
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
