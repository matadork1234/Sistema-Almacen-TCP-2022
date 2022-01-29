import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectModel } from 'src/helpers/select-model';
import { Repository } from 'typeorm';
import { UnitMeasureDTO } from './DTOs/unit-measure.dto';
import { UnitMeasure } from './entities/unit-measure.entity';

@Injectable()
export class UnitMeasureService {

    constructor(
        @InjectRepository(UnitMeasure)
        private readonly unitMeasureRepository: Repository<UnitMeasure>,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {}

    async getAllUnitMeasures(): Promise<UnitMeasure[]> {
        var dataUnitMeasures = await this.unitMeasureRepository.find();

        return dataUnitMeasures;
    }

    async getUnitMeasureById(id: number): Promise<UnitMeasure> {
        var dataUnitMeasure = await this.unitMeasureRepository.findOne(id);

        if (!dataUnitMeasure) throw new NotFoundException('Unit measure not exists');

        return dataUnitMeasure;
    }

    async getSelectUnitMeasures(): Promise<SelectModel[]> {
        var dataUnitMeasures = await this.unitMeasureRepository.find({
            where: {
                isActive: true
            },
            select: ['id', 'name']
        });

        return this.mapper.mapArray(dataUnitMeasures, SelectModel, UnitMeasure);
    }

    async createUnitMeasure(unitMeasureDTO: UnitMeasureDTO): Promise<UnitMeasure> {
        var dataUnitMeasure = this.unitMeasureRepository.create(unitMeasureDTO);

        try {
            dataUnitMeasure.isActive = true;
            await this.unitMeasureRepository.save(dataUnitMeasure);

            return dataUnitMeasure;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async updateStatus(id: number): Promise<UnitMeasure> {
        var dataUnitMeasure = await this.getUnitMeasureById(id);

        try {
            let dataStatus: boolean = false;

            if (dataUnitMeasure.isActive == true) {
                dataStatus = false;
            } else {
                dataStatus = true
            }

            dataUnitMeasure.isActive = dataStatus;
            await this.unitMeasureRepository.save(dataUnitMeasure);

            return dataUnitMeasure;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async updateUnitMeasure(id: number, unitMeasureDTO: UnitMeasureDTO): Promise<UnitMeasure> {
        var dataUnitMeasure = await this.getUnitMeasureById(id);

        try {
            let editUnitMeasure = Object.assign(dataUnitMeasure, unitMeasureDTO);
            await this.unitMeasureRepository.save(editUnitMeasure);

            return editUnitMeasure;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async deleteUnitMeasure(id: number): Promise<UnitMeasure> {
        var dataUnitMeasure = await this.getUnitMeasureById(id);

        try {
            await this.unitMeasureRepository.remove(dataUnitMeasure);

            return dataUnitMeasure;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }
}
