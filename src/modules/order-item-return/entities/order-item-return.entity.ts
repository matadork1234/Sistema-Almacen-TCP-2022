import { OrderItem } from "src/modules/order-item/entities/order-item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_item_results')
export class OrderItemReturn {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'order_item_id', nullable: false })
    orderItemId: number;

    @Column({ name: 'return_id', nullable: false })
    returnId: number;

    @Column({ name: 'issued_by', type: 'varchar', length: 150, nullable: false })
    issuedBy: string;

    @Column({ name: 'issued_at', type: 'timestamp' })
    issuedAt: Date;

    @ManyToOne(() => OrderItem, orderItem => orderItem.orderItemsReturns)
    @JoinColumn({ name: 'order_item_id', referencedColumnName: 'id' })
    orderItem: OrderItem;
}