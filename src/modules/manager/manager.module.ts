import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { ManagerMapper } from './mapper/manager.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manager
    ])
  ],
  controllers: [ManagerController],
  providers: [ManagerMapper, ManagerService],
  exports: [ManagerService]
})
export class ManagerModule {}
