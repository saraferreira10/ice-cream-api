import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IceCreamService } from './ice-cream.service';
import { CreateIceCreamDto } from './dto/create-ice-cream.dto';
import { ResponseIceCreamDto } from './dto/response-ice-cream.dto';
import { UpdateIceCreamDto } from './dto/update-ice-cream.dto';

@Controller('ice-cream')
export class IceCreamController {
  constructor(private readonly iceCreamService: IceCreamService) {}

  @Post()
  create(
    @Body() createIceCreamDto: CreateIceCreamDto,
  ): Promise<ResponseIceCreamDto> {
    return this.iceCreamService.create(createIceCreamDto);
  }

  @Get()
  findAll(): Promise<ResponseIceCreamDto[]> {
    return this.iceCreamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseIceCreamDto> {
    return this.iceCreamService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIceCreamDto: UpdateIceCreamDto,
  ): Promise<ResponseIceCreamDto> {
    return this.iceCreamService.update(id, updateIceCreamDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.iceCreamService.delete(id);
  }
}
