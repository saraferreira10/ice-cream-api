import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { NotFoundException } from '@nestjs/common';

describe('CustomersController', () => {
  let controller: CustomersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CustomersService;

  const mockCustomerService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [{ provide: CustomersService, useValue: mockCustomerService }],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /customers', () => {
    it('should return a list of customers', async () => {
      const result = [
        { id: '1', name: 'Teste', email: 'teste', phone: 'teste' },
        { id: '2', name: 'Teste', email: 'teste', phone: 'teste' },
      ];

      mockCustomerService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockCustomerService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /customers/:id', () => {
    it('should return a single customer', async () => {
      const customer = {
        id: '1',
        name: 'Teste',
        email: 'teste',
        phone: 'teste',
      };

      mockCustomerService.findOne.mockResolvedValue(customer);

      expect(await controller.findOne('1')).toEqual(customer);
      expect(mockCustomerService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if customer not found', async () => {
      mockCustomerService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('non-existing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('POST /customers', () => {
    it('should create a new customer', async () => {
      const createCustomerDto = {
        name: 'Teste',
        email: 'teste',
        phone: 'teste',
      };

      const result = { id: '1', ...createCustomerDto };

      mockCustomerService.create.mockResolvedValue(result);

      expect(await controller.create(createCustomerDto)).toEqual(result);
      expect(mockCustomerService.create).toHaveBeenCalledWith(
        createCustomerDto,
      );
    });
  });

  describe('PATCH /customers/:id', () => {
    it('should update an existing customer', async () => {
      const updateCustomerDto = { name: 'Updated Customer' };
      const result = {
        id: '1',
        name: 'Updated Customer',
        email: 'teste',
        phone: 'teste',
      };

      mockCustomerService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateCustomerDto)).toEqual(result);
      expect(mockCustomerService.update).toHaveBeenCalledWith(
        '1',
        updateCustomerDto,
      );
    });
  });

  describe('DELETE /customers/:id', () => {
    it('should remove a customer', async () => {
      mockCustomerService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.not.toThrow();
      expect(mockCustomerService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if customer to delete is not found', async () => {
      mockCustomerService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
