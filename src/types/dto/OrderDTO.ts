export type CreateOrderDTO = {
    vendorId: string;
    deliveryDate: string;
    warehouseId?: string;
    status: string;
    createdBy: string;
    deliveryStartTime: string;
    deliveryEndTime: string;
    orderItems: {
        productId: string;
        quantity: number;
        unitPrice: number;
    }[]
}
