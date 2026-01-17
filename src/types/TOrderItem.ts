import { TOrder } from "./TOrder";
import { TProduct } from "./TProduct";

export type TOrderItem = {
    id?: string;
    orderId?: TOrder;
    productId?: TProduct | string;
    productName?: string;
    quantity?: number;
    unitPrice?: number;
    totalAmount?: number;
    createdAt?: string;
    updatedAt?: string;
}