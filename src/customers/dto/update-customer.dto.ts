import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Name cannot be just spaces' })
  @ApiPropertyOptional({
    description: "The customer's name",
    example: 'José',
  })
  name: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Email cannot be just spaces' })
  @ApiPropertyOptional({
    description: "The customer's email address",
    example: 'customer@example.com',
  })
  email: string;

  @IsOptional()
  @IsPhoneNumber('BR', {
    message: 'Phone number must be a valid phone number in Brazil',
  })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Phone cannot be just spaces' })
  @ApiPropertyOptional({
    description: "The customer's phone number",
    example: '+55 11 91234-5678',
  })
  phone: string;
}
