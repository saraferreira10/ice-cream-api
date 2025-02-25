import { Item } from '../../item/entities/item.entity';
import { Category } from '../../category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class IceCream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  flavor: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @ManyToMany(() => Category, (category) => category.iceCreams)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Item, (item) => item.iceCream)
  items: Item[];

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
