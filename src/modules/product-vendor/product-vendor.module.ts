import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVendor } from './entities/product-vendor.entity';
import { ProductVendorMapper } from './mapper/product-vendor.mapper';
import { ProductVendorController } from './product-vendor.controller';
import { ProductVendorService } from './product-vendor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductVendor
    ])
  ],
  controllers: [ProductVendorController],
  providers: [ProductVendorMapper, ProductVendorService]
})
export class ProductVendorModule {}
