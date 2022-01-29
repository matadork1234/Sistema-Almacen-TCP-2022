import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectModel } from 'src/helpers/select-model';
import { Repository } from 'typeorm';
import { ProductVendorDTO } from './DTOs/product-vendor.dto';
import { ProductVendor } from './entities/product-vendor.entity';

@Injectable()
export class ProductVendorService {

    constructor(
        @InjectRepository(ProductVendor)
        private readonly productVendorRepository: Repository<ProductVendor>,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {}

    async getAllProductsVendors(): Promise<ProductVendor[]> {
        return await this.productVendorRepository.find();
    }

    async getSelectProductVendors(): Promise<SelectModel[]> {
        var dataProductVendor = await this.productVendorRepository.find({
            select: ['id', 'name']
        });

        return this.mapper.mapArray(dataProductVendor, SelectModel, ProductVendor);
    }

    async getProductVendorById(id: number): Promise<ProductVendor> {
        var dataProductVendor = await this.productVendorRepository.findOne(id);

        if (!dataProductVendor) throw new NotFoundException('Product Vendor not exists')

        return dataProductVendor;
    }

    async registerProductVendor(productVendorDTO: ProductVendorDTO): Promise<ProductVendor> {
        var dataProductVendor = this.productVendorRepository.create(productVendorDTO);

        try {
            await this.productVendorRepository.save(dataProductVendor);

            return dataProductVendor;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async updateProductVendor(id: number, productVendorDTO: ProductVendorDTO): Promise<ProductVendor> {
        var dataProductVendor = await this.getProductVendorById(id);

        try {
            let editProductVendor = Object.assign(dataProductVendor, productVendorDTO);
            await this.productVendorRepository.save(editProductVendor);

            return editProductVendor;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async deleteProductVendor(id: number): Promise<ProductVendor> {
        var dataProductVendor = await this.getProductVendorById(id);

        try {
            await this.productVendorRepository.remove(dataProductVendor);

            return dataProductVendor;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }
}
