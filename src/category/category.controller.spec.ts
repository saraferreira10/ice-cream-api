import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { NotFoundException } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /categories', () => {
    it('should return a list of categories', async () => {
      const result = [
        { id: '1', name: 'Category 1', description: 'Description 1' },
        { id: '2', name: 'Category 2', description: 'Description 2' },
      ];

      mockCategoryService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockCategoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a single category', async () => {
      const category = {
        id: '1',
        name: 'Category 1',
        description: 'Description 1',
      };

      mockCategoryService.findOne.mockResolvedValue(category);

      expect(await controller.findOne('1')).toEqual(category);
      expect(mockCategoryService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if category not found', async () => {
      mockCategoryService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      const createCategoryDto = {
        name: 'New Category',
        description: 'Description',
      };
      const result = { id: '1', ...createCategoryDto };

      mockCategoryService.create.mockResolvedValue(result);

      expect(await controller.create(createCategoryDto)).toEqual(result);
      expect(mockCategoryService.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
    });
  });

  describe('PATCH /categories/:id', () => {
    it('should update an existing category', async () => {
      const updateCategoryDto = { name: 'Updated Category' };
      const result = {
        id: '1',
        name: 'Updated Category',
        description: 'Description 1',
      };

      mockCategoryService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateCategoryDto)).toEqual(result);
      expect(mockCategoryService.update).toHaveBeenCalledWith(
        '1',
        updateCategoryDto,
      );
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should remove a category', async () => {
      mockCategoryService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.not.toThrow();
      expect(mockCategoryService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if category to delete is not found', async () => {
      mockCategoryService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
