import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put } from '@nestjs/common';
import { EntryOrderProductDTO } from './DTOs/entry-order-product.dto';
import { EntryOrderProduct } from './entities/entry-order-product.entity';
import { EntryOrderProductService } from './entry-order-product.service';

@Controller('entry-order-product')
export class EntryOrderProductController {

    constructor(private readonly entryOrderProductService: EntryOrderProductService) {

    }

    @Get('getAllEntriesProducts/:id')
    async getAllEntriesProducts(@Param('id', ParseIntPipe) id: number): Promise<EntryOrderProduct[]> {
        return this.entryOrderProductService.getAllEntriesProducts(id);
    }

    @Get(':id')
    async getEntryById(@Param('id', ParseIntPipe) id: number): Promise<EntryOrderProduct> {
        return await this.entryOrderProductService.getEntryById(id);
    }

    @Post()
    async registerOrderEntry(@Body() entryOrderProductDTO: EntryOrderProductDTO): Promise<EntryOrderProduct> {
        return await this.entryOrderProductService.registerEntryOrder(entryOrderProductDTO);
    }

    @Put(':id')
    async updateOrderEntry(@Param('id', ParseIntPipe) id: number, @Body() entryOrderProductDTO: EntryOrderProductDTO): Promise<EntryOrderProduct> {
        return await this.entryOrderProductService.updateEntryOrder(id, entryOrderProductDTO);
    }

    @Delete(':id')
    async deleteOrderEntry(@Param('id', ParseIntPipe) id: number): Promise<EntryOrderProduct> {
        return await this.entryOrderProductService.deleteEntryOrder(id);
    }
}
