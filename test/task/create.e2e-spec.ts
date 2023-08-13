import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import * as request from 'supertest';
import { taskSchema } from '../fixtures/schema/schema';
import { getUserByUsername, listProjectsByUserId } from '../fixtures/query';
import { Project, User } from '@prisma/client';

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
          validateTaskPayload(response.body, {
            name,
            description,
            user,
            project: null,
          });
        });
    });

    it('should return 201 when task is created, with no description', async () => {
      const user = await getUserByUsername(testUser1.username);
      const name = 'Task from e2e create';

      return request(app.getHttpServer())
        .post('/task')
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send({
          name,
        })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toMatchSchema(taskSchema);
          validateTaskPayload(response.body, {
            name,
            description: '',
            user,
            project: null,
          });
        });
    });

    it('should return 201 when task is created, under a project', async () => {
      const user = await getUserByUsername(testUser1.username);
      const name = 'Task from e2e create';
      const projects = await listProjectsByUserId(user.id);
      const project = projects[0];

      return request(app.getHttpServer())
        .post(`/project/${project.id}/task`)
        .set(`Authorization`, `Bearer ${accessToken}`)
        .send({
          name,
        })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toMatchSchema(taskSchema);
          validateTaskPayload(response.body, {
            name,
            description: '',
            user,
            project,
          });
        });
    });
  });
});

type ValidateTaskPayloadOptions = {
  name: string;
  description: string;
  user: User;
  project: Project | null;
};
function validateTaskPayload(
  body: any,
  { name, description, user, project }: ValidateTaskPayloadOptions,
) {
  expect(body.name).toEqual(name);
  expect(body.description).toEqual(description);
  expect(body.owner.id).toEqual(user.id);
  expect(body.owner.name).toEqual(user.name);
  expect(body.owner.email).toEqual(user.email);

  if (project) {
    expect(body.project.id).toEqual(project.id);
    expect(body.project.name).toEqual(project.name);
  } else {
    expect(body.project).toBeNull();
  }
}
