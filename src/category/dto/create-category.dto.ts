import { IsOptional, IsString, MinLength } from 'class-validator';
import { IceCream } from 'src/ice-cream/entities/ice-cream.entity';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsOptional()
  iceCreams: IceCream[];
}
