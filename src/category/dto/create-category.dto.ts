import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the category',
    example: 'Vegans',
  })
  name: string;

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the category',
    example: 'Ice cream made without any animal products.',
  })
  description: string;
}
