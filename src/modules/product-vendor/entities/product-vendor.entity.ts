import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './../../product/entities/product.entity';

@Entity('product_vendor')
export class ProductVendor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'company_code', type: 'varchar', length: 25, nullable: false })
    companyCode: string;

    @Column({ name: 'name', type: 'varchar', length: 150, nullable: false })
    name: string;

    @Column({ name: 'description', type: 'varchar', length: 1500, nullable: true })
    description?: string;

    @Column({ name: 'address_street_nro', type: 'varchar', length: 10, nullable: true })
    addressStreetNro?: string;

    @Column({ name: 'address_street_alt', type: 'varchar', length: 250, nullable: true })
    addressStreetAlt?: string;

    @Column({ name: 'address_city', type: 'varchar', length: 75, nullable: true })
    addressCity?: string;

    @Column({ name: 'address_state', type: 'varchar', length: 75, nullable: true })
    addressState?: string;

    @Column({ name: 'address_country_code', type: 'varchar', length: 10, nullable: true })
    addressCoundtryCode?: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
}