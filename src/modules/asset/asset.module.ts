import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Assets } from './entities/assets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
      Assets
    ])
  ],
  controllers: [AssetController],
  providers: [AssetService]
})
export class AssetModule {}
