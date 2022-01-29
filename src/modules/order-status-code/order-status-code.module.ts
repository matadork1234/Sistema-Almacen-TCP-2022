import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusCode } from './entities/order-status-code.entity';
import { OrderStatusCodeMapper } from './mapper/order-status-code.mapper';
import { OrderStatusCodeController } from './order-status-code.controller';
import { OrderStatusCodeService } from './order-status-code.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderStatusCode
    ])
  ],
  controllers: [OrderStatusCodeController],
  providers: [OrderStatusCodeMapper, OrderStatusCodeService]
})
export class OrderStatusCodeModule {}
