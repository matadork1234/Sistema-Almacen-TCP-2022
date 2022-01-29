import { Customer } from 'src/modules/customer/entities/customer.entity';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { OrderStatus } from 'src/modules/order-status/entities/order-status.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id', nullable: false })
  customerId: number;

  @Column({ name: 'number_order', default: 0, nullable: false })
  numberOrder: number;

  @Column({ name: 'number_order_format', type: 'varchar', length: 10, nullable: false })
  numberOrderFormat: string;

  @Column({ name: 'customer_comments', type: 'varchar', length: 500, nullable: true })
  customerComments?: string;

  @Column({ name: 'code_qr', type: 'varchar', length: 5000, nullable: true })
  codeQr?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.orders, { eager: true })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: Customer;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems: OrderItem[];

  @OneToMany(() => OrderStatus, orderStatus => orderStatus.order)
  orderStatus: OrderStatus[];
}
