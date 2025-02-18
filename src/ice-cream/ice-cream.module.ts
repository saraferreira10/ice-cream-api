import { Module } from '@nestjs/common';
import { IceCreamService } from './ice-cream.service';
import { IceCreamController } from './ice-cream.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IceCream } from './entities/ice-cream.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IceCream, Category])],
  controllers: [IceCreamController],
  providers: [IceCreamService, CategoryService],
})
export class IceCreamModule {}
