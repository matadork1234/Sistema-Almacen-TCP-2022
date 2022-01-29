import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectModel } from 'src/helpers/select-model';
import { Repository } from 'typeorm';
import { ManagerDTO } from './DTOs/manager.dto';
import { Manager } from './entities/manager.entity';
import fs = require('fs');

@Injectable()
export class ManagerService {

    constructor(
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {}

    async getAllManagers(): Promise<Manager[]> {
        return await this.managerRepository.find();
    }

    async getManagerById(id: number): Promise<Manager> {
        var dataManager = await this.managerRepository.findOne(id);

        if (!dataManager) throw new NotFoundException('Manager not exists');

        return dataManager;
    }

    async findManagerByUser(id: number): Promise<Manager> {
        var dataManager = await this.managerRepository.findOne({
            userId: id
        });

        if (!dataManager) throw new NotFoundException('Manager not exists')

        return dataManager;
    }

    async getSelectManagers(): Promise<SelectModel[]> {
        var dataManager = await this.managerRepository.find({
            where: {
                isActive: true
            },
            select: ['id', 'fullName']
        });

        return this.mapper.mapArray(dataManager, SelectModel, Manager);
    }

    async registerManager(managerDTO: ManagerDTO, userId: number): Promise<Manager> {
        var dataManager = this.managerRepository.create(managerDTO);

        try {
            //dataManager.userId = userId;
            dataManager.isActive = true;
            await this.managerRepository.save(dataManager);

            return dataManager;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async uploadImageManager(id: number, file: Express.Multer.File, userId: number): Promise<Manager> {
        var dataManager = await this.getManagerById(id);
        
        if (file) {
            if (dataManager.imageManager != null) {
                await fs.unlinkSync(`./files/img-manager/${ dataManager.imageManager }`);
                dataManager.imageManager = file.filename;
            } else {
                dataManager.imageManager = file.filename;
            }
        }

        try {
            //dataManager.userId = userId;
            await this.managerRepository.save(dataManager);
            return dataManager;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

    async updateStatusManager(id: number, data: any): Promise<Manager> {
        var dataManager = await this.getManagerById(id);

        if (dataManager.isActive) {
            dataManager.isActive = false;
        } else {
            dataManager.isActive = true;
        }

        await this.managerRepository.save(dataManager);

        return dataManager;
    }

    async updateManager(id: number, managerDTO: ManagerDTO, userId: number): Promise<Manager> {
        var dataManager = await this.getManagerById(id);

        try {
            let managerEdit = Object.assign(dataManager, managerDTO);
           // managerEdit.userId = userId;
            await this.managerRepository.save(managerEdit);
            return managerEdit;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async deleteManager(id: number): Promise<Manager> {
        var dataManager = await this.getManagerById(id);

        try {
            await this.managerRepository.remove(dataManager);

            return dataManager;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }

}
