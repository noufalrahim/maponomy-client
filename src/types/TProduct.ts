import { TCategory } from "./TCategory";

export type TProduct = {
    id?: string;
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