import { OrderStatus } from "src/modules/order-status/entities/order-status.entity";

export class OrderDetailDTO {
    id: number
    customerId: number;
    numberOrderFormat: string;
    firstNameCustomer: string
    lastNameCustomer: string;
    jobPosition: string;
    imageCustomer: string;
    numberOrder: number;
    customerComments?: string;
    codeQr?: string;
    createdAt: Date;
    updatedAt: Date;
    orderStatus: OrderStatus;
    statusOrder: OrderStatus[];
}