import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserParam } from '../auth/common/decorators/user.decorator';
import { AuthJwtGuard } from '../auth/guards/auth-jwt.guard';
import { OrderDetailDTO } from '../order/DTOs/order-detail.dto';
import { User } from '../user/entities/user.entity';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusService } from './order-status.service';

@Controller('order-status')
export class OrderStatusController {

    constructor (private readonly orderStatusService: OrderStatusService) {}

    // @Get('all-orders')
    // async getAllOrders(@UserParam() { id }: User, @Param('status', ParseIntPipe) status: number): Promise<OrderDetailDTO[]> {
    //     return await this.orderStatusService.getAllOrders(id, status);
    // }

    @Get('getAllOrdersCanceled')
    @UseGuards(AuthJwtGuard)
    async getAllOrdersCanceled(@UserParam() { id }: User): Promise<OrderStatus[]> {
        return await this.orderStatusService.getAllOrdersCanceled(id);
    }

    @Get('verifyOrderRegisterAuthorize')
    @UseGuards(AuthJwtGuard)
    async verifyOrderRegisterAuthorize(@UserParam() { id }: User): Promise<any> {
        return await this.orderStatusService.verifyOrderRegisterAuthorize(id);
    }

    @Get('getStatusByOrder/:id')
    @UseGuards(AuthJwtGuard)
    async getStatusByOrder(@Param('id', ParseIntPipe) id: number ): Promise<OrderStatus[]> {
        return await this.orderStatusService.getStatusByOrder(id);
    }

    @Get('getStatusOrder/:id')
    @UseGuards(AuthJwtGuard)
    async getStatusOrder(@Param('id', ParseIntPipe) id: number): Promise<OrderStatus> {
        return await this.orderStatusService.getStatusOrder(id);
    }

   

    
}
