import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UserParam } from '../auth/common/decorators/user.decorator';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { User } from '../user/entities/user.entity';
import { OrderDetailDTO } from './DTOs/order-detail.dto';
import { OrderItemsDTO } from './DTOs/order-items.dto';
import { OrderDTO } from './DTOs/order.dto';
import { StatusOrderDeletedDTO } from './DTOs/status-order-deleted.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) {}

    @Get()
    @UseGuards(AuthJwtGuard)
    async getAllOrders(@UserParam() { id }: User): Promise<OrderDetailDTO[]> {
        return await this.orderService.getAllOrders(id);
    }

    @Get(':id')
    async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<OrderDetailDTO> {
        return await this.orderService.getOrderById(id);
    }

    @Post()
    @UseGuards(AuthJwtGuard)
    async registerOrder(@Body() orderDTO: OrderDTO, @UserParam() { id }: User): Promise<OrderDTO> {
        return await this.orderService.registerOrder(orderDTO, id);
    }

    @Post('registerDeliverOrder')
    @UseGuards(AuthJwtGuard)
    async registerDeliverOrder(@Body() data: any, @UserParam() { id }: User): Promise<void> {
        return await this.orderService.registerDeliverOrder(data.orderId, id);
    }

    @Put('registerOrderDeleted/:id')
    @UseGuards(AuthJwtGuard)
    async registerOrderDeleted(@Param('id', ParseIntPipe) orderId: number, @Body() statusOrderDeletedDTO: StatusOrderDeletedDTO, @UserParam() { id }: User): Promise<void> {
        return await this.orderService.registerOrderDeleted(orderId, statusOrderDeletedDTO, id);
    }

    @Put('updateAuthorizeOrder/:id')
    @UseGuards(AuthJwtGuard)
    async updateAuthorizeOrder(@Param('id', ParseIntPipe) orderId: number, @Body() orderItemsDTO: OrderItemsDTO[],  @UserParam() { id }: User): Promise<void> {
        return await this.orderService.updateAuthorizeOrder(orderId, orderItemsDTO, id);
    }
}
