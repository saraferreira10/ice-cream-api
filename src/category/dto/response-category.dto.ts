import { Exclude, Expose } from 'class-transformer';
import { IceCream } from 'src/ice-cream/entities/ice-cream.entity';

export class ResponseCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;
}
