import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import * as request from 'supertest';
import { getProjectById, getUserByUsername } from '../fixtures/query';
import { projectSchema } from '../fixtures/schema/schema';

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

    it('should be able to create a project when request is correct', async () => {
      const name = 'My new created project - ' + new Date().valueOf();
      const user = await getUserByUsername(testUser1.username);
      return request(app.getHttpServer())
        .post('/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name,
        })
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toMatchSchema(projectSchema);
          expect(response.body.id).toBeDefined();
          expect(response.body.name).toEqual(name);
          expect(response.body.owner.id).toEqual(user.id);
          expect(response.body.owner.name).toEqual(user.name);
          expect(response.body.owner.email).toEqual(user.email);
          return response;
        })
        .then(async (response) => {
          // check db with id
          const projectId = response.body.id;
          const project = await getProjectById(projectId);
          expect(project.name).toEqual(name);
        });
    });

    it.each([
      [undefined],
      [
        {
          name: 1,
        },
      ],
      [{ name: false }],
      [{ name: '' }],
      ,
    ])(`should return 400 when request is "%s"`, async (payload) => {
      return request(app.getHttpServer())
        .post('/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
