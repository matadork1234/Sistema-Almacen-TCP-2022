import { OrderItem } from "src/modules/order-item/entities/order-item.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('assets')
export class Assets {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'code_asste', type: 'varchar', length: 25, nullable: false})
    codeAsset: string;

    @Column({ name: 'description_asset', type: 'varchar', length: 2500, nullable: true})
    descriptionAsset: string;

    @Column({ name: 'responsable', type: 'varchar', length: 150, nullable: false})
    responsable: string;

    @Column({ name: 'image_asset', type: 'varchar', length: 255, nullable: true})
    imageAsset: string;

    @Column({ name: 'is_active', type: 'boolean', default: false, nullable: false})
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => OrderItem, order => order.asset)
    orderItems: OrderItem[];
}