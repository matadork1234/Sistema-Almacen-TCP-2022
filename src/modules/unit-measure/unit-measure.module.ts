import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitMeasure } from './entities/unit-measure.entity';
import { UnitMeasureProfile } from './mapper/unit-measure.mapper';
import { UnitMeasureController } from './unit-measure.controller';
import { UnitMeasureService } from './unit-measure.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UnitMeasure
    ])
  ],
  controllers: [UnitMeasureController],
  providers: [UnitMeasureProfile, UnitMeasureService]
})
export class UnitMeasureModule {}
