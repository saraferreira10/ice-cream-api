import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log(`Creating category object | ${createCategoryDto}`);
    const newCategory = this.repository.create(createCategoryDto);

    this.logger.log(`Saving category object | ${newCategory}`);
    return this.repository.save(newCategory);
  }

  async findAll(): Promise<ResponseCategoryDto[]> {
    this.logger.log('Retrieving all categories.');
    const categories = await this.repository.find();
    return categories.map((category) =>
      plainToClass(ResponseCategoryDto, category),
    );
  }

  async findOne(id: string): Promise<ResponseCategoryDto> {
    this.logger.log(`Retrieving category with id ${id}.`);
    const category = await this.repository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found.`);
    return plainToClass(ResponseCategoryDto, category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Updating category with id ${id}.`);
    this.logger.log(`Searching for category with id ${id}.`);
    const category = await this.repository.findOneBy({ id });
    if (!category) throw new NotFoundException();

    this.logger.log(`Updating category with id ${id}.`);
    const updatedCategory = { ...category, ...updateCategoryDto };
    await this.repository.save(updatedCategory);
    return plainToClass(ResponseCategoryDto, updatedCategory);
  }

  async remove(id: string) {
    this.logger.log(`Deleting category with id ${id}.`);
    this.logger.log(`Searching for category with id ${id}.`);
    const category = await this.repository.findOneBy({ id });
    if (!category) throw new NotFoundException();
    await this.repository.delete(id);
  }
}
