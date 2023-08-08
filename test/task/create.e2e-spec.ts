import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import * as request from 'supertest';
import { taskSchema } from '../fixtures/schema/schema';
import { getUserByUsername } from '../fixtures/query';

describe('TaskController (e2e) - create', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  describe('/task (POST)', () => {
    it('should return 401 when not authenticated', async () => {
      return request(app.getHttpServer())
        .post('/task')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 201 when task is created', async () => {
      const user = await getUserByUsername(testUser1.username);

      const name = 'Task from e2e create';
      const description = 'My test description';

      return request(app.getHttpServer())
        .post('/task')
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send({
          name,
          description,
        })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toMatchSchema(taskSchema);
          expect(response.body.name).toEqual(name);
          expect(response.body.description).toEqual(description);
          expect(response.body.project).toBeNull();
          expect(response.body.owner.id).toEqual(user.id);
          expect(response.body.owner.name).toEqual(user.name);
          expect(response.body.owner.email).toEqual(user.email);
        });
    });
  });
});
