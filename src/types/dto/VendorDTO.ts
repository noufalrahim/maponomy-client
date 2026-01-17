export type CreateCustomerDTO = {
    name: string;
    email: string;
    password: string;
    storeImage: string | null;
    type: string;
    latitude: number;
    longitude: number;
    address: string;
    phoneNumber: string;
    salespersonId: string;
    warehouseId: string;
    active: boolean;
}