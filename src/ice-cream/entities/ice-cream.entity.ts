import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
