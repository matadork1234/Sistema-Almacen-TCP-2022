import { Assets } from "src/modules/asset/entities/assets.entity";
import { OrderItemReturn } from "src/modules/order-item-return/entities/order-item-return.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'order_id', nullable: false })
    orderId: number;

    @Column({ name: 'product_id', nullable: false })
    productId: number;

    @Column({ name: 'asset_id', nullable: true })
    assetId?: number;

    @Column({ name: 'quantity', default: 0, nullable: false })
    quantity: number;

    @Column({ name: 'quantity_approved', default: 0, nullable: false })
    quantityApproved: number;

    @Column({ name: 'price', nullable: false })
    price: number;

    @Column({ name: 'order_observation', type: 'varchar', length: 1500, nullable: true })
    orderObservation?: string;

    @ManyToOne(() => Order, order => order.orderItems)
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order: Order;

    @ManyToOne(() => Product, product => product.orderItems, { eager: true })
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product: Product;

    @ManyToOne(() => Assets, asset => asset.orderItems)
    @JoinColumn({ name: 'asset_id', referencedColumnName: 'id' })
    asset: Assets;

    @OneToMany(() => OrderItemReturn, orderItemReturn => orderItemReturn.orderItem )
    orderItemsReturns: OrderItemReturn[];
}