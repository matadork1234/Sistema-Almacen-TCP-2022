import { Product } from "src/modules/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('entry_order_products')
export class EntryOrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'product_id', nullable: false })
    productId: number;

    @Column({ name: 'quantity_order', nullable: false })
    quantityOrder: number;

    @Column({ name: 'observation_order', type: 'varchar', length: 1500, nullable: false })
    observationOrder: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => Product, product => product.entryOrdersProducts, { eager: true })
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product: Product;
}