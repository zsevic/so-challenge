import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'modules/app/app.module';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/teams (GET)', () => {
    return request(app.getHttpServer())
      .get('/teams')
      .expect(HttpStatus.OK);
  });

  it('/teams (POST)', () => {
    const team = {
      name: 'team1',
      members: [
        {
          name: 'Andy LifeBrixx',
          stackoverflow_id: 335384,
        },
        {
          name: 'user235254',
          stackoverflow_id: 235254,
        },
        {
          name: 'user235384',
          stackoverflow_id: 235384,
        },
      ],
    };

    return request(app.getHttpServer())
      .post('/teams')
      .send(team)
      .expect(HttpStatus.CREATED);
  });
});
