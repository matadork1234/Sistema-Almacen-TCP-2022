import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { SelectModel } from 'src/helpers/select-model';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { ProductVendorDTO } from './DTOs/product-vendor.dto';
import { ProductVendor } from './entities/product-vendor.entity';
import { ProductVendorService } from './product-vendor.service';

@Controller('product-vendor')
export class ProductVendorController {

    constructor(private readonly productVendorService: ProductVendorService) {}

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAllProductsVendors(): Promise<ProductVendor[]> {
        return await this.productVendorService.getAllProductsVendors();
    }

    @Get('getSelectProductVendor')
    @UseGuards(AuthJwtGuard)
    async getSelectProductVendor(): Promise<SelectModel[]> {
        return await this.productVendorService.getSelectProductVendors();
    }

    @Get(':id')
    @UseGuards(AuthJwtGuard)
    async getPorductVendorById(@Param('id', ParseIntPipe) id: number): Promise<ProductVendor> {
        return await this.productVendorService.getProductVendorById(id);
    }

    @Post()
    @UseGuards(AuthJwtGuard)
    async registerProductVendor(@Body() productVendorDTO: ProductVendorDTO): Promise<ProductVendor> {
        return await this.productVendorService.registerProductVendor(productVendorDTO);
    }

    @Put(':id')
    @UseGuards(AuthJwtGuard)
    async updateProductVendor(@Param('id', ParseIntPipe) id: number, @Body() productVendorDTO: ProductVendorDTO): Promise<ProductVendor> {
        return await this.productVendorService.updateProductVendor(id, productVendorDTO);
    }

    @Delete(':id')
    @UseGuards(AuthJwtGuard)
    async deleteProductVendor(@Param('id', ParseIntPipe) id: number): Promise<ProductVendor> {
        return await this.productVendorService.deleteProductVendor(id);
    }
}
