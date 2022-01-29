import { OrderStatus } from "src/modules/order-status/entities/order-status.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_status_codes')
export class OrderStatusCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'status_code', type: 'varchar', length: 15, nullable: false })
    statusCode: string;

    @Column({ name: 'description', type: 'varchar', length: 500, nullable: false })
    description: string;

    @Column({ name: 'is_active', default: false, nullable: false })
    isActive: boolean;

    @OneToMany(() => OrderStatus, orderStatus => orderStatus.orderStatusCode)
    orderStatus: OrderStatus[];
}