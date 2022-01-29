import { Product } from "src/modules/product/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('unit_measure')
export class UnitMeasure {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'code_unit', default: 0, nullable: false })
    codeUnit: number;

    @Column({ name: 'name', type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ name: 'name_sigma', type: 'varchar', length: 50, nullable: false  })
    nameSigma: string;

    @Column({ name: 'description', type: 'varchar', length: 250, nullable: true  })
    description: string;

    @Column({ name: 'is_active', type: 'boolean', default: false  })
    isActive: boolean;

    @OneToMany(() => Product, product => product.unitMeasure)
    products: Product[];

}