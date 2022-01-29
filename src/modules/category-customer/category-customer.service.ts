import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CategoryCustomerDTO } from './DTOs/category-customer.dto';
import { CategoryCustomer } from './entities/category-customer.entity';

@Injectable()
export class CategoryCustomerService {

    constructor(
        @InjectRepository(CategoryCustomer)
        private categoryCustomerRepository: Repository<CategoryCustomer>
    ) {}

    async assignCategories(categoryCustomerDTO: CategoryCustomerDTO): Promise<void> {

        try {
            getManager().transaction(async entityTransactionManager => {
                categoryCustomerDTO.categories.forEach(async value => {
                    var categoryCustomer = new CategoryCustomer();
                    categoryCustomer.customerId = categoryCustomerDTO.customerId;
                    categoryCustomer.categoryId = value.id;
                    categoryCustomer.isActive = true

                    await entityTransactionManager.save(categoryCustomer);
                })
            })
        } catch (error) {
            throw new BadRequestException(error.detail); 
        }

    }

    async getCategoriesCustomer(customerId: number): Promise<CategoryCustomer[]> {
        var categoriesCustomers = await this.categoryCustomerRepository.find({
            where: {
                customerId
            }
        });

        return categoriesCustomers;
    }


    async updateCategoriesCustomer(customerId: number, categoryCustomerDTO: CategoryCustomerDTO): Promise<void> {

        try {
            getManager().transaction(async entityTransactionManager => {
                var data = await entityTransactionManager.find<CategoryCustomer>(CategoryCustomer, {
                    where: {
                        customerId
                    }
                });

                await entityTransactionManager.remove<CategoryCustomer>(CategoryCustomer, data);

                categoryCustomerDTO.categories.forEach(async value => {
                    var categoryCustomer: CategoryCustomer = new CategoryCustomer();

                    categoryCustomer.customerId = customerId;
                    categoryCustomer.categoryId = value.id;
                    categoryCustomer.isActive = true

                    await entityTransactionManager.save(categoryCustomer);

                })
            })
        } catch (error) {
            throw new BadRequestException(error.detail)            
        }

    }
}
