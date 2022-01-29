import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryCustomerController } from './category-customer.controller';
import { CategoryCustomerService } from './category-customer.service';
import { CategoryCustomer } from './entities/category-customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryCustomer
    ])
  ],
  controllers: [CategoryCustomerController],
  providers: [CategoryCustomerService],
  exports: [CategoryCustomerService]
})
export class CategoryCustomerModule {}
