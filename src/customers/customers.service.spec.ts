import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { Repository, UpdateResult } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import ResponseCustomersDto from './dto/response-customers.dto';
import { plainToClass } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: jest.Mocked<Repository<Customer>>;

  const customers = [
    {
      id: '1',
      name: 'José Silva',
      email: 'jose.silva@example.com',
      phone: '+55 11 91234-5678',
    },
    {
      id: '2',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      phone: '+55 11 98765-4321',
    },
  ] as Customer[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    ) as jest.Mocked<Repository<Customer>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should return a list of customers', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue(customers);

    const result = await service.findAll();
    expect(result).toEqual(customers);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should create a new customer', async () => {
    const dto = {
      name: 'Marcos',
      phone: '+55 11 91234-5678',
      email: 'marcos@example.com',
    };

    const newCustomer = { id: customers.length + 1 + '', ...dto } as Customer;

    jest.spyOn(repository, 'create').mockReturnValue(newCustomer);
    jest.spyOn(repository, 'save').mockResolvedValue(newCustomer);

    const result = await service.create(dto);
    expect(result).toEqual(newCustomer);
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  describe('GET BY ID', () => {
    it('should return only one customer', async () => {
      const customer = {
        id: '1',
        name: 'TESTE',
        email: 'TESTE@gamil.com',
        phone: 'teste',
      } as Customer;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(customer);

      const result = await service.findOne('1');
      expect(result).toEqual(plainToClass(ResponseCustomersDto, customer));
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw a NotFoundException when customer is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('UPDATE', () => {
    it('should update a customer', async () => {
      const id = '1';
      const updateCustomerDto: UpdateCustomerDto = { name: 'Updated Name' };

      const customer = customers[0] as Customer;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(customer);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...customer, ...updateCustomerDto });

      const result = await service.update(id, updateCustomerDto);

      expect(result.name).toBe(updateCustomerDto.name);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(repository.save).toHaveBeenCalledWith({
        ...customer,
        ...updateCustomerDto,
      });
    });

    it('should throw a NotFoundException when customer is not found', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockRejectedValue(new NotFoundException());
      await expect(service.update('1', customers[0])).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('DELETE', () => {
    it('should delete a customer', async () => {
      const id = '1';

      jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValue(customers[0] as Customer);

      jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({ affected: 1, raw: [] } as UpdateResult);

      await service.remove(id);
      expect(repository.softDelete).toHaveBeenCalledWith({ id });
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw a NotFoundException when customer is not found', async () => {
      jest
        .spyOn(repository, 'findOneBy')
        .mockRejectedValue(new NotFoundException());

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
