import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './fixtures/createTestingApp';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      message: 'Hello from time tracking',
    });
  });
});
