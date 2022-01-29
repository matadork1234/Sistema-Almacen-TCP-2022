import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRoles } from 'src/app-roles';
import { In, Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { OrderDetailDTO } from '../order/DTOs/order-detail.dto';
import { UserService } from '../user/user.service';
import { OrderStatus } from './entities/order-status.entity';

@Injectable()
export class OrderStatusService {
    
    constructor(
        @InjectRepository(OrderStatus)
        private readonly orderStatusRepository: Repository<OrderStatus>,

        private readonly userService: UserService,

        private readonly customerService: CustomerService,

        @InjectMapper()
        private readonly mapper: Mapper
    ) { }


    // async getAllOrders(userId: number, status: number): Promise<OrderDetailDTO[]> {
    //     var user = await this.userService.findUserById(userId);
        
    //     if (user.role !== AppRoles.CUSTOMER) {
    //         var dataOrders = await this.orderStatusRepository.find({
    //             join: {
    //                 alias: 'orderStatus',
    //                 innerJoinAndSelect: {
    //                     order: 'orderStatus.order',
    //                     customer: 'order.customer',
    //                     manager: 'orderStatus.manager'
    //                 }
    //             },
    //             order:{
    //                 order: 'DESC'
    //             },
    //             where: {
    //                 isActive: true
    //             }
    //         });
    
    //         return this.mapper.mapArray(dataOrders, OrderDetailDTO, OrderStatus); 
    //     }

    //     var customer = await this.customerService.findCustomerByUser(user.id);

    //     var dataOrders = await this.orderRepository.find({
    //         where: {
    //             customerId: customer.id
    //         },
    //         order: {
    //             numberOrder: 'DESC'
    //         }
    //     });

    //     return this.mapper.mapArray(dataOrders, OrderDetailDTO, Order);
    // }

    async getStatusByOrder(orderId: number): Promise<OrderStatus[]> {
        var dataOrderStatus = await this.orderStatusRepository.find({
            where: {
                orderId: orderId
            }
        });

        return dataOrderStatus;
    }

    async getStatusOrder(orderId: number): Promise<OrderStatus> {
        var dataOrderStatus = await this.orderStatusRepository.findOne({
            where: {
                isActive: true,
                orderId: orderId
            }
        });

        return dataOrderStatus;
    }

    async verifyOrderRegisterAuthorize(userId: number): Promise<any> {

        var user = await this.userService.findUserById(userId);

        if (user.role == AppRoles.CUSTOMER) {

            var customer = await this.customerService.findCustomerByUser(userId);

            var [dataOrders, count] = await this.orderStatusRepository.findAndCount({
                join: {
                    alias: 'orderStatus',
                    innerJoinAndSelect: {
                        order: 'orderStatus.order',
                        orderStatusCode: 'orderStatus.orderStatusCode'
                    }
                },
                where: {
                    order: {
                        customerId: customer.id
                    },
                    orderStatusCode: {
                        statusCode: In(['1','2']),
                    },
                    isActive: true
                }
            });
            return {dataOrders, count};
        }
        
        return null;
    }

    async getAllOrdersCanceled(userId: number): Promise<OrderStatus[]> {

        var user = await this.userService.findUserById(userId);
        
        var dataOrdersCanceled;

        if (user.role !== AppRoles.CUSTOMER ) {
            dataOrdersCanceled = await this.orderStatusRepository.find({
                join: {
                    alias: 'orderStatus',
                    innerJoinAndSelect: {
                        order: 'orderStatus.order',
                        orderStatusCode: 'orderStatus.orderStatusCode'
                    },
                },
                where: {
                    orderStatusCode: {
                        statusCode: '4'
                    },
                    isActive: true
                }
            });
        } else {
            var customer = await this.customerService.findCustomerByUser(userId);
            dataOrdersCanceled = await this.orderStatusRepository.find({
                join: {
                    alias: 'orderStatus',
                    innerJoinAndSelect: {
                        order: 'orderStatus.order',
                        orderStatusCode: 'orderStatus.orderStatusCode'
                    },
                },
                where: {
                    order: {
                        customerId: customer.id
                    },
                    orderStatusCode: {
                        statusCode: '4'
                    },
                    isActive: true
                }
            });
        }


        return dataOrdersCanceled;
    }
}
