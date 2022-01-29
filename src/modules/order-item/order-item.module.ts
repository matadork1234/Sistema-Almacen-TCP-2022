import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { OrderMapper } from '../order/mappers/order.mapper';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderItem,
      OrderStatus
    ])
  ],
  controllers: [OrderItemController],
  providers: [OrderMapper,OrderItemService]
})
export class OrderItemModule {}
