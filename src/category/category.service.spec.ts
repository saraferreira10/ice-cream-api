import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { plainToClass } from 'class-transformer';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<Repository<Category>>;

  const categories: Category[] = [
    {
      id: '1',
      name: 'CATEGORY 01',
      description: 'DESCRIPTION 01',
      createdAt: new Date(),
      iceCreams: [],
    },
    {
      id: '2',
      name: 'CATEGORY 02',
      description: 'DESCRIPTION 02',
      createdAt: new Date(),
      iceCreams: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    ) as jest.Mocked<Repository<Category>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of categories', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue(categories);

    const result = await service.findAll();
    expect(result).toEqual(categories);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should create a category', async () => {
    const dto = { name: 'NEW', description: 'NEW', iceCreams: [] };
    const newCategory = { id: '1', ...dto };

    jest.spyOn(repository, 'create').mockReturnValue(newCategory);
    jest.spyOn(repository, 'save').mockResolvedValue(newCategory);

    const result = await service.create(dto);
    expect(result).toEqual(newCategory);
    expect(repository.save).toHaveBeenCalled();
  });

  describe('GET BY ID', () => {
    it('should return only one category', async () => {
      const category = {
        id: '1',
        name: 'CATEGORY',
        description: 'CATEGORY',
        iceCreams: [],
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(category);

      const result = await service.findOne('1');
      expect(result).toEqual(plainToClass(ResponseCategoryDto, category));
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('should throw a NotFoundException when category is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('UPDATE', () => {
    it('should update a category', async () => {
      const id = '1';
      const updateCategoryDto = { name: 'Updated Name' };

      const category = {
        id,
        name: 'Old Name',
        description: 'Old Description',
        createdAt: new Date(),
        iceCreams: [],
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(category);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...category, ...updateCategoryDto });

      const result = await service.update(id, updateCategoryDto);

      expect(result.name).toBe(updateCategoryDto.name);
      expect(repository.save).toHaveBeenCalledWith({
        ...category,
        ...updateCategoryDto,
      });
    });

    it('should throw a NotFoundException when category is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE', () => {
    it('should delete a category', async () => {
      const id = '1';

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(categories[1] as ResponseCategoryDto);

      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      await service.remove(id);
      expect(repository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw a NotFoundException when category is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
