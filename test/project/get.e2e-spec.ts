import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import * as request from 'supertest';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1, testUser2 } from '../fixtures/users';
import { getUserByUsername, listProjectsByUserId } from '../fixtures/query';

describe('ProjectController (e2e) - get', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  describe('/project/:id (GET)', () => {
    it('should return project info when all correct', async () => {
      const user = await getUserByUsername(testUser1.username);
      const projects = await listProjectsByUserId(user.id);
      const project = projects[0];

      return request(app.getHttpServer())
        .get(`/project/${project.id}`) // need to update
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body.id).toEqual(project.id);
          expect(response.body.name).toEqual(project.name);
          expect(response.body.owner.id).toEqual(user.id);
          expect(response.body.owner.name).toEqual(user.name);
          expect(response.body.owner.email).toEqual(user.email);
        });
    });

    it('should return 401 when no access token', async () => {
      const user = await getUserByUsername(testUser1.username);
      const projects = await listProjectsByUserId(user.id);
      const project = projects[0];

      return request(app.getHttpServer())
        .get(`/project/${project.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 when load with unknown project ID', async () => {
      return request(app.getHttpServer())
        .get(`/project/9999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 when load a project does not belong to you', async () => {
      // load another user
      const anotherUser = await getUserByUsername(testUser2.username);
      const projects = await listProjectsByUserId(anotherUser.id);
      const project = projects[0];

      return request(app.getHttpServer())
        .get(`/project/${project.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
