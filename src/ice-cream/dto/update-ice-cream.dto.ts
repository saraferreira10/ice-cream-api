import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateIceCreamDto {
  @IsString()
  @MinLength(5)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The flavor of the ice cream',
    example: 'Strawberry',
  })
  flavor: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'A description of the ice cream',
    example: 'Strawberry ice cream.',
  })
  description: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The price of the ice cream',
    example: 6.99,
  })
  price: number;
}
