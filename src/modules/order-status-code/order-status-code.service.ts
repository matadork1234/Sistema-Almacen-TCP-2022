import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectModel } from 'src/helpers/select-model';
import { Repository } from 'typeorm';
import { OrderStatusCodeDTO } from './DTOs/order-status-code.dto';
import { OrderStatusCode } from './entities/order-status-code.entity';

@Injectable()
export class OrderStatusCodeService {

    constructor(
        @InjectRepository(OrderStatusCode)
        private readonly orderStatusCodeRepository: Repository<OrderStatusCode>,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {}

    async getAllOrderStatusCodes(): Promise<OrderStatusCode[]> {
        return await this.orderStatusCodeRepository.find();
    }

    async getSelectOrderStatusCode(): Promise<SelectModel[]> {
        var dataOrderStatusCode = await this.orderStatusCodeRepository.find({
            where: {
                isActive: true
            },
            select: ['id', 'description']
        });

        return this.mapper.mapArray(dataOrderStatusCode, SelectModel, OrderStatusCode);
    }

    async getOrderStatusCodeById(id: number): Promise<OrderStatusCode> {
        var dataOrderStatusCode = await this.orderStatusCodeRepository.findOne(id);

        if (!dataOrderStatusCode) throw new NotFoundException('Order Status Code not exists');

        return dataOrderStatusCode;
    }

    async createOrderStatusCode(orderStatusCodeDTO: OrderStatusCodeDTO): Promise<OrderStatusCode> {
        var dataOrderStatus = this.orderStatusCodeRepository.create(orderStatusCodeDTO);
        
        try {
            dataOrderStatus.isActive = true;
            await this.orderStatusCodeRepository.save(dataOrderStatus);

            return dataOrderStatus;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async updateOrderStatusCode(id: number, orderStatusCodeDTO: OrderStatusCodeDTO): Promise<OrderStatusCode> {
        var dataOrderStatus = await this.getOrderStatusCodeById(id);

        try {
            let orderStatusCodeEdit = Object.assign(dataOrderStatus, orderStatusCodeDTO);
            await this.orderStatusCodeRepository.save(orderStatusCodeEdit);

            return orderStatusCodeEdit;
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async deleteOrderStatusCode(id: number): Promise<OrderStatusCode> {
        var dataOrderStatus = await this.getOrderStatusCodeById(id);

        try {
            await this.orderStatusCodeRepository.remove(dataOrderStatus);

            return dataOrderStatus;
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
    }
}
