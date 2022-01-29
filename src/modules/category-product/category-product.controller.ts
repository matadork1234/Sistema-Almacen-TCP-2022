import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { SelectModel } from 'src/helpers/select-model';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { CategoryProductService } from './category-product.service';
import { CategoryProductDTO } from './DTOs/category-product.dto';
import { CategoryProduct } from './entities/category-item.entity';

@Controller('category-product')
export class CategoryProductController {

    constructor(private readonly categoryProductService: CategoryProductService) {}

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAllCategoryProducts(): Promise<CategoryProduct[]> {
        var dataCategoryProducts = await this.categoryProductService.getAllCategoryProducts();

        return dataCategoryProducts;
    }

    @Get('getSelectCategories')
    async getSelectCategories(): Promise<SelectModel[]> {
        return await this.categoryProductService.getSelectCategoryProduct();
    }

    @Get(':id')
    @UseGuards(AuthJwtGuard)
    async getCategoryProductById(@Param('id', ParseIntPipe) id: number): Promise<CategoryProduct> {
        var dataCategoryProduct = await this.categoryProductService.getCategoryProductById(id);

        return dataCategoryProduct;
    }

    @Post()
    @UseGuards(AuthJwtGuard)
    async createCategoryProduct(@Body() categoryProductDTO: CategoryProductDTO): Promise<CategoryProduct> {
        return await this.categoryProductService.createCategoryProduct(categoryProductDTO);
    }

    @Put(':id')
    @UseGuards(AuthJwtGuard)
    async updateCategoryProduct(@Param('id', ParseIntPipe) id: number, @Body() categoryProductDTO: CategoryProductDTO): Promise<CategoryProduct> {
        return await this.categoryProductService.updateCategoryProduct(id, categoryProductDTO);
    }

    @Delete(':id')
    @UseGuards(AuthJwtGuard)
    async deleteCategoryProduct(@Param('id', ParseIntPipe) id: number): Promise<CategoryProduct> {
        return await this.categoryProductService.deleteCategoryProduct(id);
    }
}
