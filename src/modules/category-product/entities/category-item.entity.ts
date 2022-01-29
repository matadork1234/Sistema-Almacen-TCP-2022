import { CategoryCustomer } from 'src/modules/category-customer/entities/category-customer.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Product } from './../../product/entities/product.entity';

@Entity('category_product')
export class CategoryProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', length: 150, nullable: false })
    name: string;

    @Column({ name: 'code_category', default: 0, nullable: false })
    codeCategory: number;

    @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
    description: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @OneToMany(() => CategoryCustomer, cat => cat.categoryProduct)
    categoryCustomers: CategoryCustomer[]
}