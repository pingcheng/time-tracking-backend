import { HttpStatus, INestApplication } from '@nestjs/common';
import { createTestingApp } from '../fixtures/createTestingApp';
import { getAccessToken } from '../fixtures/getAccessToken';
import { testUser1 } from '../fixtures/users';
import { getUserByUsername, listProjectsByUserId } from '../fixtures/query';
import * as request from 'supertest';
import { projectSchema } from '../fixtures/schema/schema';

describe('ProjectController (e2e) - list', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();
    app = await createTestingApp();
    accessToken = await getAccessToken(app, testUser1.username, 'password');
  });

  describe('/project (GET)', () => {
    it('should return project only owned by you', async () => {
      const user = await getUserByUsername(testUser1.username);
      const projects = await listProjectsByUserId(user.id);

      return request(app.getHttpServer())
        .get('/project')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveLength(projects.length);

          response.body.forEach((receivedProject: any) => {
            const expectedProject = projects.find(
              (project) => project.id === receivedProject.id,
            );
            expect(expectedProject).toBeDefined();

            expect(receivedProject).toMatchSchema(projectSchema);
            expect(receivedProject.name).toEqual(expectedProject?.name);
            expect(receivedProject.createdAt).toEqual(
              expectedProject?.createdAt.toISOString(),
            );
            expect(receivedProject.updatedAt).toEqual(
              expectedProject?.updatedAt?.toISOString(),
            );
            expect(receivedProject.owner.id).toEqual(user.id);
            expect(receivedProject.owner.name).toEqual(user.name);
            expect(receivedProject.owner.email).toEqual(user.email);
          });
        });
    });
  });
});
