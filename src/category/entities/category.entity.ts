import { IceCream } from '../../ice-cream/entities/ice-cream.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => IceCream, (iceCream) => iceCream.categories, {
    cascade: true,
    nullable: true,
  })
  iceCreams: IceCream[];

  @CreateDateColumn()
  createdAt?: Date;
}
