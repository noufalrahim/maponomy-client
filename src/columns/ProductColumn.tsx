/* eslint-disable @typescript-eslint/no-unused-vars */
import { TProduct, TWarehouse } from "@/types";
import { TColumn } from "@/types";
import { Badge } from "@/components/ui/badge";
import { badgeFields, cn, withNA } from "@/lib/utils";

export const productColumn: TColumn<TProduct>[] = [
    {
        key: "name",
        header: "Product",
        render: (row: TProduct) => (
            <div className="flex flex-row gap-2 items-center justify-start">
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-accent text-accent-foreground">
                    {
                        row.image && row.image != "" ? (
                            <img src={`${import.meta.env.VITE_STORAGE_API}/images/${row.image}`} alt="" className="w-full h-full object-cover border border-gray-300 rounded-md" />
                        ) : (
                            <p className="font-bold">{withNA(row?.name?.charAt(0))}</p>
                        )
                    }
                </span>
                <div className="flex flex-col items-start">
                    <p className="font-semibold">{withNA(row?.name)}</p>
                </div>
            </div>
        )
    },
    {
        key: "sku",
        header: "SKU",
        render: (row: TProduct) => {
            return (
                <div className="flex flex-row gap-1 items-center">
                    <div className="w-auto bg-gray-100 px-2 text-black rounded-sm">
                        <p>{withNA(row?.sku)}</p>
                    </div>
                </div>
            )
        }
    },
    {
        key: "category",
        header: "Category",
        render: (row: TProduct) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <p>{withNA(row?.categoryId?.name)}</p>
            </div>
        )
    },
    {
        key: "measureUnit",
        header: "Unit",
        render: (row: TProduct) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <p>{withNA(row?.measureUnit)}</p>
            </div>
        )
    },
    {
        key: "packageType",
        header: "Package Type",
        render: (row: TProduct) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <p>{withNA(row?.packageType)}</p>
            </div>
        )
    },
    {
        key: "price",
        header: "Price",
        render: (row: TProduct) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <p className="text-green-500">₹{withNA(row?.price)}</p>
            </div>
        )
    },
    {
        key: "active",
        header: "Status",
        render: (row: TWarehouse) => (
            <div className="items-start flex">
                <Badge className={cn('cursor-pointer', badgeFields(row?.active ? 'active' : 'inactive').textColor, badgeFields(row?.active ? 'active' : 'inactive').bgColor)}>
                    {badgeFields(row?.active ? 'active' : 'inactive').text}
                </Badge>
            </div>
        ),
    },
];
