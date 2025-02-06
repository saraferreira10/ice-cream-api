import { Exclude, Expose } from 'class-transformer';

export class ResponseIceCreamDto {
  @Expose()
  id: string;

  @Expose()
  flavor: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt?: Date;
}
