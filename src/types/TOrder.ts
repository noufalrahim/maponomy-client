import { EOrderStatus } from "./enums/EOrderStatus";
import { TSalesPerson } from "./TSalesPerson";
import { TUser } from "./TUser";
import { TCustomer } from "./TCustomer";
import { TWarehouse } from "./TWarehouse";

export type TOrder = {
    id?: string;
    customer?: TCustomer;
    warehouse?: TWarehouse;
    deliveryDate?: string;
    deliveryStartTime?: string;
    deliveryEndTime?: string;
    totalAmount?: number;
    createdBy?: TUser;
    salesperson?: TSalesPerson;
    status?: EOrderStatus;
    createdAt?: string;
    updatedAt?: string;
    pushedToErp?: boolean;
    orderItems?: {
        productId?: string;
        productName?: string;
        productPrice?: number;
        quantity?: number;
    }[];
    orderItemsCount?: number;
}