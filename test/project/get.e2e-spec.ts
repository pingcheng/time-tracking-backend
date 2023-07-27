import { HttpStatus, INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { createTestingApp } from '../fixtures/createTestingApp';
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

    accessToken = await getAccessToken(app, 'user1', 'password');
  });

  describe('/project/:id (GET)', () => {
    it('should return project info when all correct', async () => {
      return request(app.getHttpServer())
        .get(`/project/1`) // need to update
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body.id).toEqual(1);
          expect(response.body.name).toEqual('Project 1');
          expect(response.body.owner.id).toEqual(1);
          expect(response.body.owner.name).toEqual('User 1');
          expect(response.body.owner.email).toEqual('user1@sample.com');
        });
    });

    it('should return 401 when no access token', async () => {
      return request(app.getHttpServer())
        .get(`/project/1`)
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
      return request(app.getHttpServer())
        .get(`/project/2`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
