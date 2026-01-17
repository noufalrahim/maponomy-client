import { ECustomerType } from "./enums/ECustomerType";
import { TSalesPerson } from "./TSalesPerson";
import { TUser } from "./TUser";
import { TWarehouse } from "./TWarehouse";

export type TCustomer = {
    id?: string;
    name?: string;
    address?: string;
    phoneNumber?: string;
    salespersonId?: TSalesPerson[];
    user?: TUser;
    warehouseId?: TWarehouse;
    active?: boolean;
    type?: ECustomerType;
    totalOrderValue?: number;
    createdAt?: string;
    updatedAt?: string;
    salespersonCount?: number;
    orderCount?: number;
    latitude?: number;
    longitude?: number;
    storeImage?: string;
}