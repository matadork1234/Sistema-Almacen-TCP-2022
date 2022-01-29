import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { SelectModel } from 'src/helpers/select-model';
import { UnitMeasureDTO } from './DTOs/unit-measure.dto';
import { UnitMeasure } from './entities/unit-measure.entity';
import { UnitMeasureService } from './unit-measure.service';

@Controller('unit-measure')
export class UnitMeasureController {

    constructor(private readonly unitMeasureService: UnitMeasureService) {}

    @Get()
    async getAllUnitMeasures(): Promise<UnitMeasure[]> {
        return await this.unitMeasureService.getAllUnitMeasures();
    }

    @Get('getSelectUnitMeasures')
    async getSelectUnitMeasures(): Promise<SelectModel[]> {
        return await this.unitMeasureService.getSelectUnitMeasures();
    }

    @Get(':id')
    async getUnitMeasureById(@Param('id', ParseIntPipe) id: number): Promise<UnitMeasure> {
        return await this.unitMeasureService.getUnitMeasureById(id);
    }

    @Post()
    async createUnitMeasure(@Body() unitMeasureDTO: UnitMeasureDTO): Promise<UnitMeasure> {
        return await this.unitMeasureService.createUnitMeasure(unitMeasureDTO);
    }

    @Patch(':id')
    async updateStatusUnit(@Param('id', ParseIntPipe) id: number, @Body() data: any): Promise<UnitMeasure> {
        return await this.unitMeasureService.updateStatus(id)
    }

    @Put(':id')
    async updateUnitMeasure(@Param('id', ParseIntPipe) id: number, @Body() unitMeasureDTO: UnitMeasureDTO): Promise<UnitMeasure> {
        return await this.unitMeasureService.updateUnitMeasure(id, unitMeasureDTO);
    }

    @Delete(':id')
    async deleteUnitMeasure(@Param('id', ParseIntPipe) id: number): Promise<UnitMeasure> {
        return await this.unitMeasureService.deleteUnitMeasure(id);
    }
}
