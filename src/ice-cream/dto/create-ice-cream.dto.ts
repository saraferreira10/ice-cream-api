import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateIceCreamDto {
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The flavor of the ice cream',
    example: 'Chocolate',
  })
  flavor: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the ice cream',
    example: 'Chocolate Ice Cream',
  })
  description: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The price of the ice cream',
    example: 5.99,
  })
  price: number;
}
