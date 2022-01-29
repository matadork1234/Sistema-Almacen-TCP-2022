import { Manager } from "src/modules/manager/entities/manager.entity";
import { OrderStatusCode } from "src/modules/order-status-code/entities/order-status-code.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('order_status')
export class OrderStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'order_id', nullable: false })
    orderId: number;

    @Column({ name: 'status_id', nullable: false })
    statusId: number;

    @Column({ name: 'manager_id', nullable: false })
    managerId: number;

    @Column({ name: 'observation_status', type: 'varchar', length: 1500, nullable: true})
    observationStatus: string;

    @Column({ name: 'is_active', nullable: false })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => Order, order => order.orderStatus, { eager: true })
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order: Order;

    @ManyToOne(() => OrderStatusCode, orderStatusCode => orderStatusCode.orderStatus, { eager: true })
    @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
    orderStatusCode: OrderStatusCode;
    
    @ManyToOne(() => Manager, manager => manager.orderStatus, { eager: true })
    @JoinColumn({ name: 'manager_id', referencedColumnName: 'id' })
    manager: Manager;
}