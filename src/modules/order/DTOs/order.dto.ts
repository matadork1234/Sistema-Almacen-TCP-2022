import { OrderItemDTO } from "src/modules/order-item/DTOs/order-item.dto";

export class OrderDTO {
    customerId: number;
    numberOrder: number;
    numberOrderFormat: string;
    customerComments?: string;
    codeQr?: string;
    orderItems: OrderItemDTO[];
}