import { ECustomerType } from "@/types";

export type CustomerSchema = {
    name: string;
    address: string;
    phoneNumber: string;
    salespersonId: string;
    warehouseId: string;
    latitude: string;
    longitude: string;
    storeImage: string;
    active: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    password: string;
    type: ECustomerType;
}
