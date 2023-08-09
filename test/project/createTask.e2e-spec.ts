import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1, testUser2 } from '../fixtures/users';
import * as request from 'supertest';
import { getUserByUsername, listProjectsByUserId } from '../fixtures/query';
import { taskSchema } from '../fixtures/schema/schema';

describe('ProjectController (e2e) - create task', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  describe('/project/:id/task (POST)', () => {
    it('should return 401 when create project without credentials', async () => {
      return request(app.getHttpServer())
        .post('/project/1/task')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 201 when create a task under a project', async () => {
      const user = await getUserByUsername(testUser1.username);
      const project = (await listProjectsByUserId(user.id))[0];

      const name = 'Task from e2e create';
      const description = 'My test description';

      return request(app.getHttpServer())
        .post(`/project/${project.id}/task`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name, description })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toMatchSchema(taskSchema);
          expect(response.body.id).toBeDefined();
          expect(response.body.name).toEqual(name);
          expect(response.body.project.id).toEqual(project.id);
          expect(response.body.project.name).toEqual(project.name);
          expect(response.body.owner.id).toEqual(user.id);
          expect(response.body.owner.name).toEqual(user.name);
          expect(response.body.owner.email).toEqual(user.email);
        });
    });

    it('should return 404 when create a task for a project does not belong to current user', async () => {
      const anotherUser = await getUserByUsername(testUser2.username);
      const project = (await listProjectsByUserId(anotherUser.id))[0];

      const name = 'Task from e2e create';
      const description = 'My test description';

      return request(app.getHttpServer())
        .post(`/project/${project.id}/task`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name, description })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 when create a task for a project does not exist', async () => {
      const name = 'Task from e2e create';
      const description = 'My test description';

      return request(app.getHttpServer())
        .post(`/project/999999/task`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name, description })
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
