import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { IceCream } from './entities/ice-cream.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseIceCreamDto } from './dto/response-ice-cream.dto';
import { plainToClass } from 'class-transformer';
import { UpdateIceCreamDto } from './dto/update-ice-cream.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class IceCreamService {
  private readonly logger = new Logger(IceCreamService.name);

  constructor(
    @InjectRepository(IceCream)
    private readonly iceCreamRepository: Repository<IceCream>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    createIceCreamDto: CreateIceCreamDto,
  ): Promise<ResponseIceCreamDto> {
    return await this.iceCreamRepository.manager.transaction(async () => {
      this.logger.log(`Creating ice cream flavor | ${createIceCreamDto}`);
      const categories = [];

      for (const categoryId of createIceCreamDto.categories) {
        const category = await this.categoryService.findOne(categoryId);
        if (category) {
          categories.push(category);
        } else {
          throw new NotFoundException(
            `Category with id ${categoryId} not found.`,
          );
        }
      }

      const iceCream = this.iceCreamRepository.create({
        ...createIceCreamDto,
        categories,
      });

      const savedIceCream = await this.iceCreamRepository.save(iceCream);
      return plainToClass(ResponseIceCreamDto, savedIceCream);
    });
  }

  async findAll(): Promise<ResponseIceCreamDto[]> {
    this.logger.log('Retrieving all ice cream flavors.');
    const iceCreams = await this.iceCreamRepository.find({
      relations: ['categories'],
    });

    return iceCreams.map((iceCream) =>
      plainToClass(ResponseIceCreamDto, iceCream),
    );
  }

  async findOne(id: string): Promise<ResponseIceCreamDto> {
    this.logger.log(`Retrieving ice cream flavor with id ${id}.`);
    const iceCream = await this.iceCreamRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!iceCream) throw new NotFoundException();
    return plainToClass(ResponseIceCreamDto, iceCream);
  }

  async update(
    id: string,
    updateIceCreamDto: UpdateIceCreamDto,
  ): Promise<ResponseIceCreamDto> {
    this.logger.log(`Updating ice cream flavor with id ${id}.`);

    const iceCream = await this.iceCreamRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!iceCream) throw new NotFoundException();

    if (
      !updateIceCreamDto.categories &&
      !updateIceCreamDto.description &&
      !updateIceCreamDto.flavor &&
      !updateIceCreamDto.price
    )
      throw new BadRequestException('You must override an attribute at least');

    Object.assign(iceCream, updateIceCreamDto);

    const categories = [];

    if (updateIceCreamDto.categories) {
      for (const categoryId of updateIceCreamDto.categories) {
        const category = await this.categoryService.findOne(categoryId);
        if (category) {
          categories.push(category);
        } else {
          throw new NotFoundException(
            `Category with id ${categoryId} not found.`,
          );
        }
      }
    }

    iceCream.categories = categories;

    await this.iceCreamRepository.save(iceCream);

    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting ice cream flavor with id ${id}.`);
    const iceCream = await this.iceCreamRepository.findOneBy({ id });
    if (!iceCream) throw new NotFoundException();
    await this.iceCreamRepository.softDelete(id);
  }
}
