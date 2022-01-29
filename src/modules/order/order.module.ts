import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { Customer } from '../customer/entities/customer.entity';
import { Manager } from '../manager/entities/manager.entity';
import { ManagerModule } from '../manager/manager.module';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderStatus
    ]),
    CustomerModule,
    UserModule,
    ProductModule,
    ManagerModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
