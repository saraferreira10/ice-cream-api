import { IceCream } from 'src/ice-cream/entities/ice-cream.entity';
import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => IceCream, (iceCream) => iceCream.items)
  iceCream: IceCream;

  @Column()
  quantity: number;

  get total(): number {
    return this.quantity * this.iceCream.price;
  }
}
