import { CategoryCustomer } from "src/modules/category-customer/entities/category-customer.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: false })
    firstName: string;

    @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: false })
    lastName: string;

    @Column({ name: 'document_identity', type: 'varchar', length: 15, nullable: false, unique: true })
    documentIdentity: string;

    @Column({ name: 'expedition_document', type: 'varchar', length: 15, nullable: false })
    expeditionDocument: string;

    @Column({ name: 'email_address', type: 'varchar', length: 255, nullable: false, unique: true })
    emailAddress: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 15, nullable: true })
    phoneNumber?: string;

    @Column({ name: 'image_customer', type: 'varchar', length: 255, nullable: true })
    imageCustomer?: string;

    @Column({ name: 'code_biometric', default: 0, nullable: false })
    codeBiometric: number;

    @Column({ name: 'job_position', type: 'varchar', length: 150, default:"S/C", nullable: false })
    jobPosition: string;

    @Column({ name: 'is_active', type: 'boolean', default: false, nullable: false })
    isActive: boolean;

    @Column({ name: 'user_id', nullable: false })
    userId: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(() => User, user => user.customer, { eager: true })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];

    @OneToMany(() => CategoryCustomer, cat => cat.customer)
    categoryCustomers: CategoryCustomer[];
}