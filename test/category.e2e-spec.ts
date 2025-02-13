import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CategoryModule } from '../src/category/category.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../src/category/entities/category.entity';

describe('Category (E2E)', () => {
  let app: INestApplication;
  let server: any;

  const categories = [
    { id: '1', name: 'Frutas' },
    { id: '2', name: 'Chocolate' },
  ];

  const mockCategoryRepository = {
    find: jest.fn().mockResolvedValue(categories),
    findOneBy: jest.fn().mockImplementation((criteria: { id: string }) => {
      const { id } = criteria;
      return categories.find((category) => category.id === id) || null;
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CategoryModule],
    })
      .overrideProvider(getRepositoryToken(Category))
      .useValue(mockCategoryRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  it('/GET category - 200', async () => {
    const response = await request(server).get('/category').expect(200);
    expect(response.body).toEqual(categories);
  });

  it('/GET category/:id - 200', async () => {
    const response = await request(server).get(`/category/1`);
    expect(response.body).toEqual({ id: '1', name: 'Frutas' });
    expect(response.status).toBe(200);
  });

  it('/GET category/:id - 404', async () => {
    return request(server).get('/category/not-found').expect(404);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
