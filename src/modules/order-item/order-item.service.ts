import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { Repository } from 'typeorm';
import { OrderStatus } from '../order-status/entities/order-status.entity';
import { HistoryProductDTO } from './DTOs/history-product.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderItemService {

    constructor(
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,

        @InjectRepository(OrderStatus)
        private readonly orderStatusRepository: Repository<OrderStatus>
    ) {}

    async getAllOrderItems(id: number): Promise<OrderItem[]> {
        var dataOrderItems = await this.orderItemRepository.find(
            {
                where: {
                    orderId: id
                }
            }
        );

        return dataOrderItems;
    }

    async getHistoryProduct(productId: number, customerId: number): Promise<HistoryProductDTO[]> {
        const historyProductsDTO: Array<HistoryProductDTO> = new Array<HistoryProductDTO>();
        var dataOrderItems = await this.orderItemRepository.find({
            where: {
                productId: productId
            }
        });

        for (var i = 0; i< dataOrderItems.length; i++) {
            var dataOrderStatus = await this.orderStatusRepository.findOne({
                join: {
                    alias: 'os',
                    innerJoinAndSelect: {
                        orderStatusCode: 'os.orderStatusCode',
                        order: 'os.order',                      
                    }
                },
                where: {
                    orderId: dataOrderItems[i].orderId,
                    orderStatusCode: {
                        statusCode: 3
                    }
                }
            });

            if (dataOrderStatus !== undefined) {
                if (dataOrderStatus?.order.customerId === customerId) {
                    var historyProduct = new HistoryProductDTO();

                    historyProduct.id = dataOrderItems[i].orderId;
                    historyProduct.descriptionProduct = dataOrderItems[i].product.descriptionCatalogue;
                    historyProduct.numberOrderFormat = dataOrderStatus?.order.numberOrderFormat;
                    historyProduct.quantity = dataOrderItems[i].quantity;
                    historyProduct.quantityApproved = dataOrderItems[i].quantityApproved;
                    historyProduct.dateRegister = dataOrderStatus?.createdAt;
                    historyProduct.status = dataOrderStatus?.orderStatusCode.description;
                    //console.log(historyProduct);

                    historyProductsDTO.push(historyProduct);
                }
            }
        }
        
        return new Promise<HistoryProductDTO[]>((resolve, reject) => resolve(historyProductsDTO));
    }
}
