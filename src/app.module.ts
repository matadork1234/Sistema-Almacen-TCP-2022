import { TYPEORM_CONFIG } from './config/constant';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { CategoryProductModule } from './modules/category-product/category-product.module';
import { ProductVendorModule } from './modules/product-vendor/product-vendor.module';
import { CustomerModule } from './modules/customer/customer.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { OrderStatusCodeModule } from './modules/order-status-code/order-status-code.module';
import { OrderItemReturnModule } from './modules/order-item-return/order-item-return.module';
import { ManagerModule } from './modules/manager/manager.module';
import { OrderStatusModule } from './modules/order-status/order-status.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccessControlModule } from 'nest-access-control';
import databaseConfig from './config/database.config';
import { roles } from './app-roles';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UnitMeasureModule } from './modules/unit-measure/unit-measure.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryCustomerModule } from './modules/category-customer/category-customer.module';
import { EntryOrderProductModule } from './modules/entry-order-product/entry-order-product.module';
import { AssetModule } from './modules/asset/asset.module';
import * as Joi from 'joi';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => 
        config.get(TYPEORM_CONFIG)
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      // envFilePath: '.env'
      envFilePath: `.env.${ process.env.NODE_ENV || 'development' }`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development')
      }),
    }),
    AutomapperModule.forRoot({
      options: [{ name: 'blah', pluginInitializer: classes }],
      singular: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files')
    }),
    AccessControlModule.forRoles(roles),
    ProductModule,
    CategoryProductModule,
    ProductVendorModule,
    CustomerModule,
    UserModule,
    OrderModule,
    OrderItemModule,
    OrderStatusCodeModule,
    OrderItemReturnModule,
    ManagerModule,
    OrderStatusModule,
    AuthModule,
    UnitMeasureModule,
    CategoryCustomerModule,
    EntryOrderProductModule,
    AssetModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
