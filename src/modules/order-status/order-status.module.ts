import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { OrderStatus } from './entities/order-status.entity';
import { OrderStatusMapper } from './mappers/order-status.mapper';
import { OrderStatusController } from './order-status.controller';
import { OrderStatusService } from './order-status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderStatus
    ]),
    UserModule,
    CustomerModule
  ],
  controllers: [OrderStatusController],
  providers: [OrderStatusMapper, OrderStatusService]
})
export class OrderStatusModule {}
