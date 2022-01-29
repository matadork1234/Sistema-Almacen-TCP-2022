import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMapper } from './mappers/product.mapper';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import { CategoryCustomerModule } from '../category-customer/category-customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product
    ]),
    UserModule,
    CustomerModule,
    CategoryCustomerModule
  ],
  providers: [ProductMapper, ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
