import { Module } from '@nestjs/common';
import { OrderItemReturnController } from './order-item-return.controller';
import { OrderItemReturnService } from './order-item-return.service';

@Module({
  controllers: [OrderItemReturnController],
  providers: [OrderItemReturnService]
})
export class OrderItemReturnModule {}
