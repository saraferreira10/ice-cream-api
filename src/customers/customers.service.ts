import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ResponseCustomersDto from './dto/response-customers.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    this.logger.log(`Creating customer object | ${createCustomerDto}`);
    const newCustomer = this.customerRepository.create(createCustomerDto);

    this.logger.log(`Saving customer object | ${newCustomer}`);
    const savedCustomer = await this.customerRepository.save(newCustomer);
    return plainToClass(ResponseCustomersDto, savedCustomer);
  }

  async findAll(): Promise<ResponseCustomersDto[]> {
    this.logger.log('Retrieving all customers.');
    const customers = await this.customerRepository.find();
    return customers.map((customer) =>
      plainToClass(ResponseCustomersDto, customer),
    );
  }

  async findOne(id: string): Promise<ResponseCustomersDto> {
    this.logger.log(`Retrieving customer with id ${id}.`);
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException();
    return plainToClass(ResponseCustomersDto, customer);
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<ResponseCustomersDto> {
    this.logger.log(`Updating customer with id ${id}.`);
    this.logger.log(`Searching for customer with id ${id}.`);
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException();

    this.logger.log(`Updating customer with id ${id}.`);
    const savedCustomer = await this.customerRepository.save({
      ...customer,
      ...updateCustomerDto,
    });
    return plainToClass(ResponseCustomersDto, savedCustomer);
  }

  async remove(id: string) {
    this.logger.log(`Deleting customer with id ${id}.`);
    this.logger.log(`Searching for customer with id ${id}.`);
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException();
    await this.customerRepository.softDelete({ id });
  }
}
