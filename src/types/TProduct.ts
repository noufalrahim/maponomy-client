import { TCategory } from "./TCategory";
import { TCustomer } from "./TCustomer";

export type TProduct = {
    id?: string;
    vendorId?: TCustomer;
    image?: string;
    name?: string;
    categoryId?: TCategory;
    quantitySold?: number;
    measureUnit?: string;
    packageType?: string;
    sku?: string;
    price?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}