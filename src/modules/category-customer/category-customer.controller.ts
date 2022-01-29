import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryCustomerService } from './category-customer.service';
import { CategoryCustomerDTO } from './DTOs/category-customer.dto';
import { CategoryCustomer } from './entities/category-customer.entity';

@Controller('category-customer')
export class CategoryCustomerController {

    constructor(private readonly categoryCustomerService: CategoryCustomerService) {}

    @Post()
    async asssignCategories(@Body() categoryCustomerDTO: CategoryCustomerDTO): Promise<void> {
        return await this.categoryCustomerService.assignCategories(categoryCustomerDTO);
    }

    @Get(':id')
    async getCustormerCategories(@Param('id', ParseIntPipe) id: number): Promise<CategoryCustomer[]> {
        return await this.categoryCustomerService.getCategoriesCustomer(id);
    }

    @Put(':id')
    async updateCustomerCategories(@Param('id', ParseIntPipe) id: number, @Body() categoryCusotmerDTO: CategoryCustomerDTO): Promise<void> {
        return await this.categoryCustomerService.updateCategoriesCustomer(id, categoryCusotmerDTO);
    } 
}
