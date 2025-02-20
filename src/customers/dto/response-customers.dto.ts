import { Expose } from 'class-transformer';

export default class ResponseCustomersDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;
}
