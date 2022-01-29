import { BadRequestException, Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { CustomerDTO } from './DTOs/customer.dto';
import { Customer } from './entities/customer.entity';
import fs = require('fs');
import { CustomerUserDTO } from './DTOs/customer-user.dto';
import { User } from '../user/entities/user.entity';
import { AppRoles } from 'src/app-roles';
import { CategoryCustomer } from '../category-customer/entities/category-customer.entity';
import e = require('express');
import { CategoryProduct } from '../category-product/entities/category-item.entity';

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ) { }

    async getAllCustomers(): Promise<Customer[]> {
        return await this.customerRepository.find();
    }

    async getCustomerById(id: number): Promise<Customer> {
        var dataCustomer = await this.customerRepository.findOne(id);

        if (!dataCustomer) {
            throw new NotFoundException('Customer not exists');
        }

        return dataCustomer;
    }

    async findCustomerByUser(id: number): Promise<Customer> {
        var dataCustomer = await this.customerRepository.findOne({
            where: {
                userId: id
            }
        });

        if (!dataCustomer) throw new NotFoundException('Customer not assign account');

        return dataCustomer;
    }

    async createCustomer(customerDTO: CustomerDTO): Promise<Customer> {
        var dataCustomer = this.customerRepository.create(customerDTO);

        try {
            dataCustomer.isActive = true;
            await this.customerRepository.save(dataCustomer);
            return dataCustomer;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async uploadImageCustomer(id: number, file: Express.Multer.File, userId: number): Promise<Customer> {
        var dataCustomer = await this.customerRepository.findOne(id);
        if (file) {
            if (dataCustomer.imageCustomer === null) {
                dataCustomer.imageCustomer = file.filename;
            } else {
                await fs.unlinkSync(`./files/img-customer/${dataCustomer.imageCustomer}`);
                dataCustomer.imageCustomer = file.filename;
            }
        }

        try {
            await this.customerRepository.save(dataCustomer);
            return dataCustomer;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async updateCustomer(id: number, customerDTO: CustomerDTO): Promise<Customer> {
        var dataCustomer = await this.getCustomerById(id);

        try {
            let customerEdit = Object.assign(dataCustomer, customerDTO);
            await this.customerRepository.save(customerEdit);

            return customerEdit;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async updateStatusCustomer(id: number, data: any): Promise<Customer> {
        var dataCustomer = await this.getCustomerById(id);

        if (dataCustomer.isActive) {
            dataCustomer.isActive = false;
        } else {
            dataCustomer.isActive = true;
        }

        await this.customerRepository.save(dataCustomer);

        return dataCustomer;
    }

    async registerMultipleUsers(customerUserDto: CustomerUserDTO[]): Promise<void> {
        var listUsers: User[] = [];
        var listCustomers: Customer[] = [];
        var listCategoriesCustomer: CategoryCustomer[] = [];
        
        await getManager().transaction(async entityTransactionManager => {
            try {
                for (let index = 0; index < customerUserDto.length; index++) {
                    var userExists = await entityTransactionManager.findOne<User>(User, {
                        where: {
                            username: customerUserDto[index].username.toString()
                        }
                    });

                    if (!userExists) {
                        var user = new User();
                        user.username = customerUserDto[index].username.toString();
                        user.password = customerUserDto[index].password.toString();
                        user.email = customerUserDto[index].email.toString();
                        user.isActive = true;
                        user.emailConfirmation = false;
                        user.role = AppRoles.CUSTOMER;
                        listUsers.push(user);
                    }
                }

                var dataUsers = await entityTransactionManager.save(listUsers);
                
                for (let index = 0; index < customerUserDto.length; index++) {
                    var dataUser = dataUsers.find(p => p.username == customerUserDto[index].username);

                    var customerExists = await entityTransactionManager.findOne<Customer>(Customer, {
                        where: {
                            documentIdentity: customerUserDto[index].documentIdentity
                        }
                    });

                    if (!customerExists) {
                        var customer = new Customer();
                        customer.firstName = customerUserDto[index].firstName;
                        customer.lastName = customerUserDto[index].lastName;
                        customer.documentIdentity = customerUserDto[index].documentIdentity.toString();
                        customer.expeditionDocument = 'CHUQUISACA';
                        customer.codeBiometric = customerUserDto[index].codeBiometric;
                        customer.emailAddress = customerUserDto[index].email;
                        customer.jobPosition = customerUserDto[index].jobPosition;
                        customer.phoneNumber = customerUserDto[index].phoneNumber;
                        customer.isActive = true;
                        customer.userId = dataUser.id;
                        customer.imageCustomer = customerUserDto[index].imageCustomer ? customerUserDto[index].imageCustomer : null;

                        listCustomers.push(customer);
                    }
                }

                var dataCustomersSave = await entityTransactionManager.save(listCustomers);
                for (let index = 0; index < dataCustomersSave.length; index++) {
                    
                    // var dataCustomer = dataCustomersSave.find(p => p.documentIdentity == customerUserDto[index].documentIdentity);

                    // var customerCategoriesExists = await entityTransactionManager.find<CategoryCustomer>(CategoryCustomer, {
                    //     where: {
                    //         customerId: dataCustomer.id
                    //     }
                    // });

                    if (typeof customerUserDto[index].categoryId === 'number') {
                        
                        var categoryProduct = await entityTransactionManager.findOne<CategoryProduct>(CategoryProduct, {
                            where: {
                                codeCategory: parseInt(customerUserDto[index].categoryId)
                            }
                        });

                        var categoriesCustomer = new CategoryCustomer();
                        categoriesCustomer.customerId = dataCustomersSave[index].id;
                        categoriesCustomer.categoryId = categoryProduct.id;
                        categoriesCustomer.isActive = true;
                        listCategoriesCustomer.push(categoriesCustomer);
                    }
                    else {
                        var category: string[] = Object.assign([], customerUserDto[index].categoryId);
                        for (let i = 0; i < category.length; i++) {
                            if(category[i] !== ',') {

                                var categoryProduct = await entityTransactionManager.findOne<CategoryProduct>(CategoryProduct, {
                                    where: {
                                        codeCategory: parseInt(category[i])
                                    }
                                });

                                var categoriesCustomer = new CategoryCustomer();
                                categoriesCustomer.customerId = dataCustomersSave[index].id;
                                categoriesCustomer.categoryId = categoryProduct.id;
                                categoriesCustomer.isActive = true;
                                listCategoriesCustomer.push(categoriesCustomer);
                            }
                        }
                    }
            
                }

                var dataCategoryCustomers = await entityTransactionManager.save(listCategoriesCustomer);

            } catch (error) {
                console.log(error);
                throw new BadRequestException(error)
            }
        });
    }

    async deleteCustomer(id: number): Promise<Customer> {
        var dataCustomer = await this.getCustomerById(id);

        try {
            await this.customerRepository.remove(dataCustomer);
            return dataCustomer;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }
}
