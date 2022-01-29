import { hash } from "bcrypt";
import { Customer } from "src/modules/customer/entities/customer.entity";
import { Manager } from "src/modules/manager/entities/manager.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'username', type: 'varchar', length: 25, nullable: false, unique: true })
    username: string;

    @Column({ name: 'password', type: 'varchar', length: 150, nullable: false })
    password: string;

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email?: string;

    @Column({ name: 'is_locked', type: 'boolean', default: false, nullable: true })
    isLocked?: boolean;

    @Column({ name: 'email_confirmation', type: 'boolean', default: false, nullable: true })
    emailConfirmation?: boolean;

    @Column({ name: 'role', type: 'varchar', length: 15, nullable: false })
    role: string;

    @Column({ name: 'is_active', type: 'boolean', default: false, nullable: false })
    isActive: boolean;
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;
    
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return;
        }
        this.password = await hash(this.password, 10);
    }
    
    @OneToOne(() => Customer, customer => customer.user)
    customer: Customer;

    @OneToOne(() => Manager, mgr => mgr.user)
    manager: Manager;


}