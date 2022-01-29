import { CategoryProduct } from './../../category-product/entities/category-item.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { TTypeProduct } from '../Enums/type-product.enum';
import { UnitMeasure } from 'src/modules/unit-measure/entities/unit-measure.entity';
import { EntryOrderProduct } from 'src/modules/entry-order-product/entities/entry-order-product.entity';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'image_product', type: 'varchar', length: 255, nullable: true })
    imageProduct?: string;

    @Column({ name: 'code_product_sigma', type: 'varchar', length: 15, nullable: false })
    codeProductSigma: string;

    @Column({ name: 'description_catalogue', type: 'varchar', length: 5000, nullable: false })
    descriptionCatalogue: string;

    @Column({ name: 'description_stock', type: 'varchar', length: 5000, nullable: true })
    descriptionStock?: string;

    @Column({ name: 'stock', default: 0, nullable: false })
    stock: number;

    @Column({ name: 'restrict_stock', default: 0, nullable: false })
    restrictStock: number;

    @Column({ name: 'type_product', type: 'enum', enum: TTypeProduct, nullable: false })
    typeProduct: TTypeProduct;

    @Column({ name: 'sigma', type: 'boolean', default: false, nullable: false })
    sigma: boolean;

    @Column({ name: 'category_id', nullable: false })
    categoryId: number;

    @Column({ name: 'unit_measure_id', nullable: false })
    unitMeasureId: number;

    @Column({ name: 'is_toner', default: false, nullable: false })
    isToner: boolean;

    @Column({ name: 'is_active', default: false, nullable: false })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => CategoryProduct, category => category.products, { eager: true })
    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    category: CategoryProduct;

    @ManyToOne(() => UnitMeasure, unit => unit.products, { eager: true })
    @JoinColumn({ name:  'unit_measure_id', referencedColumnName: 'id' })
    unitMeasure: UnitMeasure;

    @OneToMany(() => OrderItem, orderItem => orderItem.product)
    orderItems: OrderItem[];

    @OneToMany(() =>EntryOrderProduct, entry => entry.product)
    entryOrdersProducts: EntryOrderProduct[];
}