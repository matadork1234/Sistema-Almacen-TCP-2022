import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectModel } from 'src/helpers/select-model';
import { getManager, Repository } from 'typeorm';
import { CategoryProductDTO } from './DTOs/category-product.dto';
import { CategoryProduct } from './entities/category-item.entity';

@Injectable()
export class CategoryProductService {

    constructor(
        @InjectRepository(CategoryProduct)
        private readonly categoryProductRepository: Repository<CategoryProduct>,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {}

    async getAllCategoryProducts(): Promise<CategoryProduct[]> {
        var dataCategoryProducts = await this.categoryProductRepository.find();
        return dataCategoryProducts;
    }

    async getCategoryProductById(id: number): Promise<CategoryProduct> {
        var dataCategoryProducts = await this.categoryProductRepository.findOne(id);

        if (!dataCategoryProducts)
            throw new NotFoundException('Category Product not exists');
        
        return dataCategoryProducts;
    }

    async getSelectCategoryProduct(): Promise<SelectModel[]> {
        var dataCategoryProducts = await this.categoryProductRepository.find({
            select: ['id', 'name']
        });

        return this.mapper.mapArray(dataCategoryProducts, SelectModel, CategoryProduct);
    }

    async createCategoryProduct(categoryProductDTO: CategoryProductDTO): Promise<CategoryProduct> {
        var dataCategoryProduct = this.categoryProductRepository.create(categoryProductDTO);

        try {
            await this.categoryProductRepository.save(dataCategoryProduct);
            return dataCategoryProduct;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async updateCategoryProduct(id: number, categoryProductDTO: CategoryProductDTO): Promise<CategoryProduct> {
        var dataCategoryProduct = await this.getCategoryProductById(id);

        try {
            var editCategoryProduct = Object.assign(dataCategoryProduct, categoryProductDTO);
            await this.categoryProductRepository.save(editCategoryProduct);

            return editCategoryProduct;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async deleteCategoryProduct(id: number): Promise<CategoryProduct> {
        var dataCategoryProduct = await this.getCategoryProductById(id);

        try {
            await this.categoryProductRepository.remove(dataCategoryProduct);
            
            return dataCategoryProduct;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }
}
