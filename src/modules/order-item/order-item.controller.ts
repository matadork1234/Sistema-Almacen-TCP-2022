import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HistoryProductDTO } from './DTOs/history-product.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemService } from './order-item.service';

@Controller('order-item')
export class OrderItemController {

    constructor(private readonly orderItemService: OrderItemService) {}

    @Get('getHistoryProduct/:productId/:customerId')
    async getHistoryProduct(@Param('productId', ParseIntPipe) productId: number, @Param('customerId', ParseIntPipe) customerId: number): Promise<HistoryProductDTO[]> {
        return await this.orderItemService.getHistoryProduct(productId, customerId);
    }

    @Get(':id')
    async getAllOrderItems(@Param('id', ParseIntPipe) id: number): Promise<OrderItem[]> {
        return await this.orderItemService.getAllOrderItems(id);
    }
}
