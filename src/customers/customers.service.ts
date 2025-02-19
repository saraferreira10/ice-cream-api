import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    const newCustomer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(newCustomer);
  }

  findAll() {
    return this.customerRepository.find();
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException();
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException();
    const updatedCustomer = { ...customer, ...updateCustomerDto };
    return this.customerRepository.save(updatedCustomer);
  }

  async remove(id: string) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException();
    await this.customerRepository.softDelete({ id });
  }
}
