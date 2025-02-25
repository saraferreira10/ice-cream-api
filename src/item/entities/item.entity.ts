import { IceCream } from 'src/ice-cream/entities/ice-cream.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => IceCream, (iceCream) => iceCream.items)
  iceCream: IceCream;

  @Column()
  quantity: number;
}
