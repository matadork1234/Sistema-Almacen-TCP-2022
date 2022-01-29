import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { EntryOrderProductDTO } from './DTOs/entry-order-product.dto';
import { EntryOrderProduct } from './entities/entry-order-product.entity';

@Injectable()
export class EntryOrderProductService {
    constructor(
        @InjectRepository(EntryOrderProduct)
        private readonly entryOrderProductRepository: Repository<EntryOrderProduct>
    ) {}

    async getAllEntriesProducts(productId: number): Promise<EntryOrderProduct[]> {
        var dataEntries = await this.entryOrderProductRepository.find({
            where: {
                productId: productId
            }
        });
        return dataEntries;
    }

    async getEntryById(id: number): Promise<EntryOrderProduct> {
        var dataEntry = await this.entryOrderProductRepository.findOne(id);

        if (!dataEntry) throw new BadRequestException('Order Entry Product not exists!')

        return dataEntry;
    }

    async registerEntryOrder(entryOrderProductDTO: EntryOrderProductDTO): Promise<EntryOrderProduct> {
        var data = this.entryOrderProductRepository.create(entryOrderProductDTO);

        try {
            await getManager().transaction(async entityTransactionManager => {
                
                var result = await entityTransactionManager.save(data);

                var productEntity = await entityTransactionManager.findOne<Product>(Product, {
                    where: {
                        id: result.productId
                    }
                });

                productEntity.stock = productEntity.stock + result.quantityOrder
                
                await entityTransactionManager.save(productEntity);

            })
            return data;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async updateEntryOrder(id: number, entryOrderProductDTO: EntryOrderProductDTO): Promise<EntryOrderProduct> {
        var dataEntry = await this.getEntryById(id);

        try {
            var editDataEntry = Object.assign(dataEntry, entryOrderProductDTO);

            await this.entryOrderProductRepository.save(editDataEntry);
            return dataEntry;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
        
    }

    async deleteEntryOrder(id: number): Promise<EntryOrderProduct> {
        var dataEntry = await this.getEntryById(id);

        try {
            await this.entryOrderProductRepository.remove(dataEntry);

            return dataEntry;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }
}
