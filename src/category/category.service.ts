import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.repository.create(createCategoryDto);
    return this.repository.save(newCategory);
  }

  async findAll(): Promise<ResponseCategoryDto[]> {
    const categories = await this.repository.find();
    return categories.map((category) =>
      plainToClass(ResponseCategoryDto, category),
    );
  }

  async findOne(id: string): Promise<ResponseCategoryDto> {
    const category = await this.repository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found.`);
    return plainToClass(ResponseCategoryDto, category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.repository.findOneBy({ id });
    if (!category) throw new NotFoundException();
    const updatedCategory = { ...category, ...updateCategoryDto };
    await this.repository.save(updatedCategory);
    return plainToClass(ResponseCategoryDto, updatedCategory);
  }

  async remove(id: string) {
    const category = await this.repository.findOneBy({ id });
    if (!category) throw new NotFoundException();
    await this.repository.delete(id);
  }
}
