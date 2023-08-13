import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

type CreateTaskOptions = {
  name: string;
  description?: string;
  projectId?: string;
};

export async function createTask(
  app: INestApplication,
  accessToken: string,
  { name, description, projectId }: CreateTaskOptions,
): Promise<number> {
  let path = '/task';
  if (projectId) {
    path = `/project/${projectId}/task`;
  }

  const response = await request(app.getHttpServer())
    .post(path)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name,
      description,
    });

  return response.body.id;
}
