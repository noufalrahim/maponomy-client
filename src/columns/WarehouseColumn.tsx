import { TWarehouse } from "@/types";
import { TColumn } from "@/types";
import { Badge } from "@/components/ui/badge";
import { badgeFields, cn, withNA } from "@/lib/utils";
import { Building2, MapPin, Warehouse } from "lucide-react";

export const warehouseColumn: TColumn<TWarehouse>[] = [
    {
        key: "name",
        header: "Warehouse",
        render: (row: TWarehouse) => (
            <div className="flex flex-row gap-2 items-center justify-start">
                <span className="flex items-center justify-center w-10 h-10 rounded-md bg-accent text-accent-foreground">
                    <Warehouse size={20} />
                </span>
                <div className="flex flex-col items-start">
                    <p className="font-semibold">{withNA(row?.name)}</p>
                </div>
            </div>
        )
    },
    {
        key: "address",
        header: "Address",
        render: (row: TWarehouse) => {
            return (
                <div className="flex flex-row gap-1 items-center text-gray-500 ">
                    <MapPin size={13} />
                    <p>{withNA(row?.address)}</p>
                </div>
            )
        }
    },
    {
        key: "coordinates",
        header: "Coordinates",
        render: (row: TWarehouse) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <p>{withNA(row?.latitude)}, {withNA(row?.longitude)}</p>
            </div>
        )
    },
    {
        key: "customers",
        header: "Customers Mapped",
        render: (row: TWarehouse) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <Building2 size={13} />
                <p>{withNA(row?.vendorCount)}</p>
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
