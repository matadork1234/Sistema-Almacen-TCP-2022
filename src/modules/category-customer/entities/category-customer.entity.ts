import { CategoryProduct } from "src/modules/category-product/entities/category-item.entity";
import { Customer } from "src/modules/customer/entities/customer.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('category_customer')
export class CategoryCustomer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'customer_id', nullable: false })
    customerId: number;

    @Column({ name: 'category_id', nullable: false })
    categoryId: number;

    @Column({ name: 'is_active', nullable: false })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => Customer, customer => customer.categoryCustomers, { eager: true })
    @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
    customer: Customer;

    @ManyToOne(() => CategoryProduct, category => category.categoryCustomers, { eager: true })
    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    categoryProduct: CategoryProduct;
}