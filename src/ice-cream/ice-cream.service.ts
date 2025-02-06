import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { IceCream } from './entities/ice-cream.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseIceCreamDto } from './dto/response-ice-cream.dto';
import { plainToClass } from 'class-transformer';
import { UpdateIceCreamDto } from './dto/update-ice-cream.dto';

@Injectable()
export class IceCreamService {
  private readonly logger = new Logger(IceCreamService.name);

  constructor(
    @InjectRepository(IceCream)
    private readonly iceCreamRepository: Repository<IceCream>,
  ) {}

  async create(
    createIceCreamDto: CreateIceCreamDto,
  ): Promise<ResponseIceCreamDto> {
    this.logger.log(`Creating ice cream flavor | ${createIceCreamDto}`);
    const iceCream = this.iceCreamRepository.create(createIceCreamDto);
    const savedIceCream = await this.iceCreamRepository.save(iceCream);
    return plainToClass(ResponseIceCreamDto, savedIceCream);
  }

  async findAll(): Promise<ResponseIceCreamDto[]> {
    this.logger.log('Retrieving all ice cream flavors.');
    const iceCreams = await this.iceCreamRepository.find();
    return iceCreams.map((iceCream) =>
      plainToClass(ResponseIceCreamDto, iceCream),
    );
  }

  async findOne(id: string): Promise<ResponseIceCreamDto> {
    this.logger.log(`Retrieving ice cream flavor with id ${id}.`);
    const iceCream = await this.iceCreamRepository.findOneBy({ id });
    if (!iceCream) throw new NotFoundException();
    return plainToClass(ResponseIceCreamDto, iceCream);
  }

  async update(
    id: string,
    updateIceCreamDto: UpdateIceCreamDto,
  ): Promise<ResponseIceCreamDto> {
    this.logger.log(`Updating ice cream flavor with id ${id}.`);

    const iceCream = await this.iceCreamRepository.findOneBy({ id });
    if (!iceCream) throw new NotFoundException();

    Object.assign(iceCream, updateIceCreamDto);
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
