import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { UserParam } from '../auth/common/decorators/user.decorator';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { User } from '../user/entities/user.entity';
import { CustomerService } from './customer.service';
import { CustomerDTO } from './DTOs/customer.dto';
import { Customer } from './entities/customer.entity';
import { filenameExt } from 'src/helpers/filename';
import { imageFileFilter } from 'src/helpers/image-file-filter';
import { CustomerUserDTO } from './DTOs/customer-user.dto';

const MULTER_OPTIONS: MulterOptions = {
    storage: diskStorage({
        destination: './files/img-customer',
        filename: filenameExt
    }),
    fileFilter: imageFileFilter
}

@Controller('customer')
export class CustomerController {

    constructor(private customerService: CustomerService) {}

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAllCustomers(): Promise<Customer[]> {
        return await this.customerService.getAllCustomers();
    }

    @Get('findCustomerByUser')
    @UseGuards(AuthJwtGuard)
    async findCustomerByUser(@UserParam() { id }: User): Promise<Customer> {
        return await this.customerService.findCustomerByUser(id);
    } 

    @Get(':id')
    @UseGuards(AuthJwtGuard)
    async getCustomerById(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
        return await this.customerService.getCustomerById(id);
    }
    
    @Post('registerMultipleUsers')
    async registerMultipleUsers(@Body() customerUserDTO: CustomerUserDTO[]): Promise<void> {
        return await this.customerService.registerMultipleUsers(customerUserDTO);
    }
    
    @Post()
    @UseGuards(AuthJwtGuard)
    async createCustomer(@Body() customerDTO: CustomerDTO, @UserParam() { id } : User): Promise<Customer> {
        return await this.customerService.createCustomer(customerDTO);
    }

    @Patch(':id')
    @UseGuards(AuthJwtGuard)
    async updateStatusCustomer(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<Customer> {
        return this.customerService.updateStatusCustomer(id, data);
    }

    @Put('uploadImageCustomer/:id')
    @UseGuards(AuthJwtGuard)
    @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
    async uploadImageCustomer(@Param('id', ParseIntPipe) customerId: number, @UploadedFile() file: Express.Multer.File, @UserParam() { id }: User): Promise<Customer> {
        console.log(file);
        return await this.customerService.uploadImageCustomer(customerId, file, id);
    }

    @Put(':id')
    @UseGuards(AuthJwtGuard)
    async updateCustomer(@Param('id', ParseIntPipe) customerId: number, @Body() customerDTO: CustomerDTO, @UserParam() { id }: User): Promise<Customer> {
        return await this.customerService.updateCustomer(customerId, customerDTO);
    }

    @Delete(':id')
    @UseGuards(AuthJwtGuard)
    async deleteCustomer(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
        return await this.customerService.deleteCustomer(id);
    }
    

}
