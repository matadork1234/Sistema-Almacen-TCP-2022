import { Module } from '@nestjs/common';
import { CategoryProductService } from './category-product.service';
import { CategoryProductController } from './category-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProduct } from './entities/category-item.entity';
import { CategoryProductMapper } from './mappers/category-product.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryProduct
    ])
  ],
  providers: [CategoryProductMapper, CategoryProductService],
  controllers: [CategoryProductController]
})
export class CategoryProductModule {}
