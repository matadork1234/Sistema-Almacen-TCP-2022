import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { SelectModel } from 'src/helpers/select-model';
import { OrderStatusCodeDTO } from './DTOs/order-status-code.dto';
import { OrderStatusCode } from './entities/order-status-code.entity';
import { OrderStatusCodeService } from './order-status-code.service';

@Controller('order-status-code')
export class OrderStatusCodeController {

    constructor(private readonly orderStatusCodeService: OrderStatusCodeService) {}

    @Get()
    async getAllOrderStatusCodes(): Promise<OrderStatusCode[]> {
        return await this.orderStatusCodeService.getAllOrderStatusCodes();
    }

    @Get('getSelectOrderStatusCode')
    async getSelectOrderStatusCode(): Promise<SelectModel[]> {
        return await this.orderStatusCodeService.getSelectOrderStatusCode();
    }

    @Get(':id')
    async getOrderStatusCodeById(@Param('id', ParseIntPipe) id: number): Promise<OrderStatusCode> {
        return await this.orderStatusCodeService.getOrderStatusCodeById(id);
    }

    @Post()
    async createOrderStatusCode(@Body() orderStatusCodeDTO: OrderStatusCodeDTO): Promise<OrderStatusCode> {
        return await this.orderStatusCodeService.createOrderStatusCode(orderStatusCodeDTO);
    }

    @Put(':id')
    async updateOrderStatusCode(@Param('id', ParseIntPipe) id: number, @Body() orderStatusCodeDTO: OrderStatusCodeDTO): Promise<OrderStatusCode> {
        return await this.orderStatusCodeService.updateOrderStatusCode(id, orderStatusCodeDTO);
    }

    @Delete(':id')
    async deleteOrderStatusCode(@Param('id', ParseIntPipe) id: number): Promise<OrderStatusCode> {
        return await this.orderStatusCodeService.deleteOrderStatusCode(id);
    }
}
