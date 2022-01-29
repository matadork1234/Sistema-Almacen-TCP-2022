export class OrderItemDTO {
    orderId: number;
    assetId?: number;
    productId: number;
    quantity: number;
    quantityApproved: number;
    price: number;
    orderObservation?: string;
}