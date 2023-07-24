import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createTestingApp } from '../fixtures/createTestingApp';
import { mockedUser, mockedUserPassword } from '../fixtures/mockedUsers';
import {
  mockedAnotherProject,
  mockedAnotherProjectWithOwner,
  mockedProject,
  mockedProjectWithOwner,
} from '../fixtures/mockedProject';
import * as request from 'supertest';
import { getAccessToken } from '../fixtures/getAccessToken';

describe('ProjectController (e2e) - get', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let accessToken: string;

  beforeEach(async () => {
    jest.restoreAllMocks();

    app = await createTestingApp();
    prismaService = app.get(PrismaService);

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockedUser);

    accessToken = await getAccessToken(
      app,
      mockedUser.username,
      mockedUserPassword,
    );
  });

  describe('/project/:id (GET)', () => {
    it('should return project info when all correct', async () => {
      // bad workaround
      // https://github.com/prisma/prisma/discussions/7084
      jest
        .spyOn(prismaService.project, 'findUnique')
        .mockResolvedValue(mockedProjectWithOwner);

      return request(app.getHttpServer())
        .get(`/project/${mockedProject.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body.id).toEqual(mockedProject.id);
          expect(response.body.name).toEqual(mockedProject.name);
          expect(response.body.owner.id).toEqual(mockedUser.id);
          expect(response.body.owner.name).toEqual(mockedUser.name);
          expect(response.body.owner.email).toEqual(mockedUser.email);
        });
    });

    it('should return 401 when no access token', async () => {
      return request(app.getHttpServer())
        .get(`/project/${mockedProject.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 when load with unknown project ID', async () => {
      jest.spyOn(prismaService.project, 'findUnique').mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/project/9999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return 404 when load a project does not belong to you', async () => {
      jest
        .spyOn(prismaService.project, 'findUnique')
        .mockResolvedValue(mockedAnotherProjectWithOwner);

      return request(app.getHttpServer())
        .get(`/project/${mockedAnotherProject.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
