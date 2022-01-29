import { OrderItemsDTO } from "./order-items.dto";

export class AuthorizeOrderDTO {
    orderId: number;
    orderItems: OrderItemsDTO[];
}