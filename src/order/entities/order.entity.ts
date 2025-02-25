import { Customer } from 'src/customers/entities/customer.entity';
import { Item } from 'src/item/entities/item.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import OrderStatus from '../enums/status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @OneToMany(() => Item, (item) => item.order)
  items: Item[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('decimal', { default: 0 })
  total: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotal() {
    this.total = this.items.reduce((total, item) => total + item.total, 0);
  }
}
