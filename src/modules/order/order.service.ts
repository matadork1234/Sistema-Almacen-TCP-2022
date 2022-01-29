import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRoles } from 'src/app-roles';
import { getManager, Repository } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { Manager } from '../manager/entities/manager.entity';
import { ManagerService } from '../manager/manager.service';
import { OrderItem } from '../order-item/entities/order-item.entity';
import { OrderStatusCode } from '../order-status-code/entities/order-status-code.entity';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { Product } from '../product/entities/product.entity';
import { UserService } from '../user/user.service';
import { OrderDetailDTO } from './DTOs/order-detail.dto';
import { OrderItemsDTO } from './DTOs/order-items.dto';
import { OrderQrDTO } from './DTOs/order-qr.dto';
import { OrderDTO } from './DTOs/order.dto';
import { StatusOrderDeletedDTO } from './DTOs/status-order-deleted.dto';
import { Order } from './entities/order.entity';
import { TStatusDeleted } from './enums/status-deleted.enum';
import { generateQr } from './helpers/generate-qr';

@Injectable()
export class OrderService {

    constructor(
        private readonly customerService: CustomerService,

        private readonly managerService: ManagerService,

        private readonly userService: UserService,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,

        @InjectMapper()
        private readonly mapper: Mapper
    ) {}


    async getAllOrders(userId: number): Promise<OrderDetailDTO[]> {

        var user = await this.userService.findUserById(userId);
        if (user.role !== AppRoles.CUSTOMER) {
            var dataOrders = await this.orderRepository.find({
                order: {
                    numberOrder: 'DESC'
                }
            });
    
            return this.mapper.mapArray(dataOrders, OrderDetailDTO, Order); 
        }

        var customer = await this.customerService.findCustomerByUser(user.id);

        var dataOrders = await this.orderRepository.find({
            where: {
                customerId: customer.id
            },
            order: {
                numberOrder: 'DESC'
            }
        });

        return this.mapper.mapArray(dataOrders, OrderDetailDTO, Order);
    }

    async getOrderById(id: number): Promise<OrderDetailDTO> {
        var dataOrder = await this.orderRepository.findOne(id);

        if (!dataOrder) throw new NotFoundException('Order not exists!!');

        return this.mapper.map(dataOrder, OrderDetailDTO, Order);
    }

    async registerOrder(orderDTO: OrderDTO, userId: number): Promise<OrderDTO> {
        var customer = await this.customerService.findCustomerByUser(userId);
        var numberOrder = 0;
        var dateNow = Date.now();
        var date = new Date(dateNow);
        var dataOrder = await this.orderRepository.find({
            order: {
                numberOrder: 'DESC'
            },
            select: ['id', 'numberOrder'],
            take: 1
        });

        if (dataOrder.length !== 0) {
            numberOrder = dataOrder[0].numberOrder;
            numberOrder+= 1;
        } else {
            numberOrder = 1;
        }

        try {
            await getManager().transaction(async transationEntityManager => {
                var order = new Order();
    
                order.customerId = customer.id;
                order.numberOrder = numberOrder;
                order.numberOrderFormat = `${ numberOrder}/${ date.getFullYear() }`
                order.customerComments = orderDTO.customerComments;
                order.codeQr = '';
                
                var createdOrder = await transationEntityManager.save(order);

              //  console.log(orderDTO.orderItems);
    
                orderDTO.orderItems.forEach(async (value) => {
                    var orderItem = new OrderItem();
                    orderItem.orderId = createdOrder.id;
                    orderItem.assetId = value.assetId;
                    orderItem.productId = value.productId;
                    orderItem.quantity = value.quantity;
                    orderItem.quantityApproved = 0;
                    orderItem.price = 0;
                    orderItem.orderObservation = value.orderObservation;
    
                    await transationEntityManager.save(orderItem);
                });

                var statusCode = await transationEntityManager.findOne<OrderStatusCode>(OrderStatusCode, {
                    where: {
                        statusCode: 1
                    }
                });
    
                var statusOrder = new OrderStatus();
    
                statusOrder.managerId = 1;
                statusOrder.orderId = createdOrder.id;
                statusOrder.statusId = statusCode.id;
                statusOrder.isActive = true;
    
                await transationEntityManager.save(statusOrder);
    
                var dataOrderEdit = await transationEntityManager.findOne<Order>(Order, createdOrder.id);
            
                var orderQr = new OrderQrDTO();
    
                orderQr.firstName = customer.firstName;
                orderQr.lastName = customer.lastName;
                orderQr.numberDocumentIdentity = customer.documentIdentity;
                orderQr.numberOrder = dataOrderEdit.numberOrderFormat;
                orderQr.registerAt = dataOrderEdit.createdAt;
                orderQr.updateAt = dataOrderEdit.updatedAt;

                dataOrderEdit.codeQr = generateQr(orderQr);
    
                await transationEntityManager.save(dataOrderEdit);
            });

            return orderDTO;

        } catch (error) {
            throw new BadRequestException(error.detail);
        }

    }

    async registerOrderDeleted(id: number, statusOrderDeletedDTO: StatusOrderDeletedDTO, userId: number): Promise<void> {
        
        var manager = await this.managerService.findManagerByUser(userId);

        await getManager().transaction(async entityTransacionManager => {
            try {
                var orderActive = await entityTransacionManager.findOne<OrderStatus>(OrderStatus, {
                    where: {
                        isActive: true,
                        orderId: id
                    }
                });
    
                if (orderActive) {
                    orderActive.isActive = false;
    
                    await entityTransacionManager.save(orderActive);
                }
    
                var orderStatusCode = await entityTransacionManager.findOne<OrderStatusCode>(OrderStatusCode, {
                    where: {
                        isActive: true,
                        statusCode: '4'
                    }
                });

                switch (statusOrderDeletedDTO.statusDeleted) {
                    case TStatusDeleted.deletedRegister:{
                        var orderStatus = new OrderStatus();
                        orderStatus.statusId = orderStatusCode.id;
                        orderStatus.orderId = id;
                        orderStatus.observationStatus = statusOrderDeletedDTO.observationOrder;
                        orderStatus.isActive = true;
                        orderStatus.managerId = manager.id

                        await entityTransacionManager.save(orderStatus);    
                        break;
                    }
                    case TStatusDeleted.deletedAuthorize: {
                        let listProducts: Product[] = [];
                        var orderItems = await entityTransacionManager.find<OrderItem>(OrderItem, {
                            where: {
                                orderId: id
                            }
                        });
                        
                        for (let index = 0; index < orderItems.length; index++) {
                            var product = await entityTransacionManager.findOne<Product>(Product, {
                                where: {
                                    id: orderItems[index].productId
                                }
                            });
                            product.stock = product.stock + orderItems[index].quantityApproved;
                            listProducts.push(product);
                        }

                        await entityTransacionManager.save(listProducts);   

                        var orderStatus = new OrderStatus();
                        orderStatus.statusId = orderStatusCode.id;
                        orderStatus.orderId = id;
                        orderStatus.observationStatus = statusOrderDeletedDTO.observationOrder;
                        orderStatus.isActive = true;
                        orderStatus.managerId = manager.id

                        await entityTransacionManager.save(orderStatus);   

                        break;
                    }
                    default:{
                        let listProducts: Product[] = [];
                        var orderItems = await entityTransacionManager.find<OrderItem>(OrderItem, {
                            where: {
                                orderId: id
                            }
                        });

                        for (let index = 0; index < orderItems.length; index++) {
                            var product = await entityTransacionManager.findOne<Product>(Product, {
                                where: {
                                    id: orderItems[index].productId
                                }
                            });
                            product.stock = product.stock + orderItems[index].quantityApproved;
                            listProducts.push(product);
                        }

                        await entityTransacionManager.save(listProducts);   

                        var orderStatus = new OrderStatus();
                        orderStatus.statusId = orderStatusCode.id;
                        orderStatus.orderId = id;
                        orderStatus.observationStatus = 'Su Solicitud fue anulada ya que en el plazo de 72 horas no se procedio a recepcionar su entrega respectiva';
                        orderStatus.isActive = true;
                        orderStatus.managerId = manager.id

                        await entityTransacionManager.save(orderStatus);   

                        break;
                    }
                }

                
            } catch (error) {
                throw new BadRequestException(error)
            }
        });
    }




    async updateAuthorizeOrder(orderId: number, orderItemsDTO: OrderItemsDTO[], userId: number): Promise<void> {
        var managerData = await this.managerService.findManagerByUser(userId);

        try {
            await getManager().transaction(async transactionEntityManager => {
                
                orderItemsDTO.forEach(async (value) => {
                    await transactionEntityManager.update<OrderItem>(OrderItem, { id: value.orderItemId }, {
                        quantityApproved: value.quantityApproved
                    });

                    var data = await transactionEntityManager.findOne<Product>(Product, {
                        where: {
                            id: value.productId
                        }
                    });

                    if (data.stock > 0) {
                        data.stock = data.stock - value.quantityApproved;
                        await transactionEntityManager.save(data);
                    } else {
                        throw new Error('Product stock is empty');
                    }

                });

                var dataOrderStatus = await transactionEntityManager.findOne<OrderStatus>(OrderStatus, {
                    where: {
                        isActive: true,
                        orderId: orderId
                    }
                });

                dataOrderStatus.isActive = false
                await transactionEntityManager.save(dataOrderStatus);

                var statusCode = await transactionEntityManager.findOne<OrderStatusCode>(OrderStatusCode, {
                    where: {
                        statusCode: 2
                    }
                });

                var statusOrder = new OrderStatus()
                statusOrder.managerId = managerData.id;
                statusOrder.orderId = orderId;
                statusOrder.statusId = statusCode.id;
                statusOrder.isActive = true;

                await transactionEntityManager.save(statusOrder);
            })
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

    async registerDeliverOrder(orderId: number, userId: number): Promise<void> {
        try {
            getManager().transaction(async transationEntityManager => {

                var dataOrderStatus = await transationEntityManager.findOne<OrderStatus>(OrderStatus, {
                    where: {
                        orderId: orderId,
                        isActive: true
                    }
                });
                
                var orderStatus = await transationEntityManager.findOne<OrderStatus>(OrderStatus, { id: dataOrderStatus.id});
                orderStatus.isActive = false;

                await transationEntityManager.save(orderStatus);


                var statusCode = await transationEntityManager.findOne<OrderStatusCode>(OrderStatusCode, {
                    where: {
                        statusCode: 3
                    }
                });

                var manager = await transationEntityManager.findOne<Manager>(Manager, {
                    where: {
                        userId: userId
                    }
                });

                var newOrderStatus = new OrderStatus();
                newOrderStatus.orderId = orderId;
                newOrderStatus.statusId = statusCode.id;
                newOrderStatus.isActive = true;
                newOrderStatus.managerId = manager.id;

                await transationEntityManager.save(newOrderStatus);

            });
        } catch (error) {
            throw new BadRequestException(error.detail);
        }
    }

}
