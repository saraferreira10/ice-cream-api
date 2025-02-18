import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Name cannot be just spaces' })
  @ApiProperty({
    description: "The customer's name",
    example: 'José',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Email cannot be just spaces' })
  @ApiProperty({
    description: "The customer's email address",
    example: 'jose@example.com',
  })
  email: string;

  @IsPhoneNumber('BR', {
    message: 'Phone number must be a valid phone number in Brazil',
  })
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Phone cannot be just spaces' })
  @ApiProperty({
    description: "The customer's phone number",
    example: '+55 11 91234-5678',
  })
  phone: string;
}
