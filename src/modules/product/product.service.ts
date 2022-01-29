import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, In, MoreThan, Repository } from 'typeorm';
import { ProductDTO } from './DTOs/product.dto';
import { Product } from './entities/product.entity';
import fs = require('fs');
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { SearchProductDTO } from './DTOs/search-product.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AppRoles } from 'src/app-roles';
import { CustomerService } from '../customer/customer.service';
import { CategoryCustomerService } from '../category-customer/category-customer.service';
import { UnitMeasure } from '../unit-measure/entities/unit-measure.entity';
import { CategoryProduct } from '../category-product/entities/category-item.entity';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        private readonly userService: UserService,

        private readonly customerService: CustomerService,

        private readonly categoryCustomerService: CategoryCustomerService,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {}

    async getAllProducts(): Promise<Product[]> {
        var dataProduct = await this.productRepository.find();
        return dataProduct;
    }

    async getAllActiveProducts(userId: number): Promise<SearchProductDTO[]> {
         var user = await this.userService.findUserById(userId);

        var dataProducts: ProductDTO[] = [];

        if (user.role == AppRoles.ADMIN) {
            dataProducts = await this.productRepository.find({
                where: {
                    isActive: true
                }
            });
        } else {
            var customerProfile = await this.customerService.findCustomerByUser(user.id);
            var categoriesCustomer = await (await this.categoryCustomerService.getCategoriesCustomer(customerProfile.id)).map(p => p.categoryId);

            dataProducts = await this.productRepository.find({
                where: {
                    categoryId: In(categoriesCustomer),
                    stock: MoreThan(0),
                    isActive: true
                }
            });
        }
        
        return this.mapper.mapArray(dataProducts, SearchProductDTO, Product);

    }

    async getSearchProducts(q: string): Promise<Product[]> {
        console.log(q);
        var dataProducts = await this.productRepository.createQueryBuilder()
                .where("LOWER(description_catalogue) LIKE :nameProduct OR LOWER(code_product_sigma) LIKE :codeProduct", { nameProduct: `%${ q.toLowerCase() }%`, codeProduct: `%${ q.toLowerCase() }%` })
                .getMany();

        return dataProducts;
    }

    async getProductById(id: number): Promise<Product> {
        var dataProduct = await this.productRepository.findOne(id);

        if (!dataProduct) throw new NotFoundException('Product not exists');

        return dataProduct;
    }

    async registerManyProducts(productsDTO: ProductDTO[]): Promise<void> {
        var listProducts: Product[] = [];
        await getManager().transaction(async entityTransacionManager => {
           try {
            for (let index = 0; index < productsDTO.length; index++) {
                var isToner = false;
                var unitMeasure = await entityTransacionManager.findOne<UnitMeasure>(UnitMeasure, {
                    where: {
                        codeUnit: productsDTO[index].unitMeasureId
                    }
                });

                var categoryProduct = await entityTransacionManager.findOne<CategoryProduct>(CategoryProduct, {
                    where: {
                        codeCategory: productsDTO[index].categoryId
                    }
                })

                if (productsDTO[index].isToner) {
                    isToner = true;
                }

                var product = new Product();
                product.codeProductSigma = productsDTO[index].codeProductSigma;
                product.descriptionCatalogue = productsDTO[index].descriptionCatalogue;
                product.descriptionStock = productsDTO[index].descriptionStock;
                product.imageProduct = null;
                product.isActive = true;
                product.isToner = isToner;
                product.sigma =  productsDTO[index].sigma;
                product.stock = productsDTO[index].stock;
                product.unitMeasureId = unitMeasure.id;
                product.typeProduct = productsDTO[index].typeProduct;
                product.categoryId = categoryProduct.id;

                listProducts.push(product);
            }

           await entityTransacionManager.save(listProducts);
           } catch (error) {
               console.log(error);
               throw new BadRequestException(error);
           }
        })
    }

    async registerProduct(productoDTO: ProductDTO): Promise<Product> {
        var dataProduct = this.productRepository.create(productoDTO);

        try {
            await this.productRepository.save(dataProduct);

            return dataProduct;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async uploadImageProduct(id: number, file: Express.Multer.File): Promise<Product> {
        var dataProduct = await this.productRepository.findOne(id);

        if (file) {
            if (dataProduct.imageProduct !== null) {
                await fs.unlinkSync(`./files/img-products/${ dataProduct.imageProduct }`);
                dataProduct.imageProduct = file.filename;
            } else {
                dataProduct.imageProduct = file.filename;
            }
        }

        try {
            await this.productRepository.save(dataProduct);
            return dataProduct
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async updateProduct(id: number, productDTO: ProductDTO): Promise<Product> {
        var dataProduct = await this.getProductById(id);

        var editProduct = Object.assign(dataProduct, productDTO);

        try {
            await this.productRepository.save(editProduct);

            return editProduct;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async updateStatusProduct(id: number): Promise<Product> {
        var dataProduct = await this.getProductById(id);

        try {
            if (dataProduct.isActive === true) {
                dataProduct.isActive = false
            } else {
                dataProduct.isActive = true
            }

            await this.productRepository.save(dataProduct);

            return dataProduct;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async deleteProduct(id: number): Promise<Product> {
        var dataProduct = await this.getProductById(id);

        try {
            await this.productRepository.remove(dataProduct);

            return dataProduct;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async deleteImageProduct(id: number): Promise<Product> {
        var dataProduct = await this.getProductById(id);

        try {
            if (dataProduct.imageProduct !== null) {
                fs.unlinkSync(`./files/img-products/${ dataProduct.imageProduct }`);
                dataProduct.imageProduct = null;
                
                await this.productRepository.save(dataProduct);

                return dataProduct;
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }


}
