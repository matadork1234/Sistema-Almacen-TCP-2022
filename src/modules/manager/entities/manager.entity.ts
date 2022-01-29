import { OrderStatus } from "src/modules/order-status/entities/order-status.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('managers')
export class Manager {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'full_name', type: 'varchar', length: 150, nullable: false })
    fullName: string;

    @Column({ name: 'number_document_identity', type: 'varchar', length: 15, nullable: false })
    numberDocumentIdentity: number;

    @Column({ name: 'job_position', type: 'varchar', length: 85, nullable: false })
    jobPosition: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 12, nullable: true })
    phoneNumber?: string;

    @Column({ name: 'user_id', nullable: false })
    userId: number;

    @Column({ name: 'code_biometric', default: 0, nullable: false })
    codeBiometric: number;

    @Column({ name: 'image_manager', type: 'varchar', length: 255, nullable: true })
    imageManager?: string;

    @Column({ name: 'is_active', type: 'boolean', default: false, nullable: false })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @OneToOne(() => User, user => user.manager, { eager: true })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;

    @OneToMany(() => OrderStatus, orderStatus => orderStatus.manager)
    orderStatus: OrderStatus[];
}