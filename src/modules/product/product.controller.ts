import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { AppRoles } from 'src/app-roles';
import { filenameExt } from 'src/helpers/filename';
import { imageFileFilter } from 'src/helpers/image-file-filter';
import { UserParam } from '../auth/common/decorators/user.decorator';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ProductDTO } from './DTOs/product.dto';
import { SearchProductDTO } from './DTOs/search-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

const MULTER_OPTIONS: MulterOptions = {
    storage: diskStorage({
        destination: './files/img-products',
        filename: filenameExt
    }),
    fileFilter: imageFileFilter
}

@Controller('product')
export class ProductController {

    constructor(private readonly productService: ProductService,
                private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAllProducts(@UserParam() { id }: User): Promise<Product[]> {
        var dataUser = await this.userService.findUserById(id);

        if (dataUser.role !== AppRoles.CUSTOMER) {
            return await this.productService.getAllProducts();
        }
        // add query for get all category customers
        return this.productService.getAllProducts();
    }

    @Get('getAllActiveProducts')
    @UseGuards(AuthJwtGuard)
    async getAllActiveProducts(@UserParam() { id }: User): Promise<SearchProductDTO[]> {
        return await this.productService.getAllActiveProducts(id);
    }

    @Get('searchProducts?')
    async searchProducts(@Query('q') q: string): Promise<Product[]> {
        return await this.productService.getSearchProducts(q);
    }

    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return await this.productService.getProductById(id);
    }

    @Post('registerManyProducts')
    async registerManyProducts(@Body() productsDTO: ProductDTO[]): Promise<void> {
        return await this.productService.registerManyProducts(productsDTO);
    }

    @Post()
    async registerProduct(@Body() productDTO: ProductDTO): Promise<Product> {
        return await this.productService.registerProduct(productDTO);
    }

    @Put('uploadImageProduct/:id')
    @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
    async uploadImageProduct(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        return await this.productService.uploadImageProduct(id, file);
    }

    @Patch('updateStatusProduct/:id')
    async updateStatusProduct(@Param('id', ParseIntPipe) id: number, @Body() status: any): Promise<Product> {
        return await this.productService.updateStatusProduct(id);
    }

    @Put(':id')
    async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() productDTO: ProductDTO): Promise<Product> {
        return await this.productService.updateProduct(id, productDTO);
    }

    @Delete(':id')
    async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return await this.productService.deleteProduct(id);
    }

    @Delete('deleteImageProduct/:id')
    async deleteImageProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return await this.productService.deleteImageProduct(id);
    }
}
