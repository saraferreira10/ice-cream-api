import * as request from 'supertest';
import { INestApplication, NotFoundException } from '@nestjs/common';
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
    create: jest.fn().mockImplementation((dto) => ({
      id: '1',
      ...dto,
      createdAt: new Date().toISOString(),
    })),
    save: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: '1',
        ...dto,
        createdAt: new Date().toISOString(),
      }),
    ),
    delete: jest.fn().mockResolvedValue((criteria: { id: string }) => {
      const { id } = criteria;
      if (categories.find((category) => category.id === id)) {
        return { affected: 1 };
      } else {
        throw new NotFoundException();
      }
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

  it('/POST category - 201', async () => {
    const dto = {
      name: 'Frutas',
      description: 'Deliciosos sorvetes de fruta.',
    };

    const response = await request(server).post(`/category`).send(dto);

    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');

    expect(response.body.name).toBe(dto.name);
    expect(response.body.description).toBe(dto.description);

    expect(response.status).toBe(201);
  });

  it('/DELETE category/:id - 200', async () => {
    const id = categories[0].id;
    const response = await request(server).del(`/category/${id}`);
    expect(response.status).toBe(200);
  });

  it('/DELETE category/:id - 404', async () => {
    const response = await request(server).del('/category/not-found');
    expect(response.status).toBe(404);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
