import { Module } from '@nestjs/common';
import { EntryOrderProductService } from './entry-order-product.service';
import { EntryOrderProductController } from './entry-order-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryOrderProduct } from './entities/entry-order-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EntryOrderProduct
    ])
  ],
  providers: [EntryOrderProductService],
  controllers: [EntryOrderProductController]
})
export class EntryOrderProductModule {}
