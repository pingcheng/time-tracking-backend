import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function getAccessToken(
  app: INestApplication,
  username: string,
  password: string,
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/authentication/login')
    .send({
      username,
      password,
    });
  return response.body.access_token;
}
