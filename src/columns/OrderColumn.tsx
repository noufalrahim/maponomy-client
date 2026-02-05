import { EOrderStatus, TOrder, TProduct } from "@/types";
import { TColumn } from "@/types";
import { Badge } from "@/components/ui/badge";
import { badgeFields, cn, withNA } from "@/lib/utils";
import { Calendar } from "lucide-react";

export const orderColumn: TColumn<TOrder>[] = [
    {
        key: "id",
        header: "Order ID",
        render: (row: TProduct) => (
            <div className="flex flex-row gap-2 items-center justify-start">
                <p>{withNA(row?.id)}</p>
            </div>
        )
    },
    {
        key: "customer",
        header: "Customer",
        tooltip: true,
        tooltipValue: (row: TOrder) => row.customer?.name || '',
        render: (row: TOrder) => {
            return (
                <div className="flex flex-row gap-1 items-center">
                    <p className="font-semibold">{withNA(row?.customer?.name)}</p>
                </div>
            )
        }
    },
    {
        key: "warehouse",
        header: "Warehouse",
        tooltip: true,
        tooltipValue: (row: TOrder) => row.warehouse?.name || '',
        render: (row: TOrder) => {
            return (
                <div className="flex flex-row gap-1 text-gray-500">
                    <p>{withNA(row?.warehouse?.name)}</p>
                </div>
            )
        }
    },
    {
        key: "salesperson",
        header: "Sales Rep",
        tooltip: true,
        tooltipValue: (row: TOrder) => row.salesperson?.name || '',
        render: (row: TOrder) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <p>{withNA(row?.salesperson?.name)}</p>
            </div>
        )
    },
    {
        key: "createdAt",
        header: "Order Date",
        render: (row: TOrder) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <Calendar size={14} />
                <p>{withNA(new Date(row.createdAt!).toLocaleDateString())}</p>
            </div>
        )
    },
    {
        key: "deliveryDate",
        header: "Delivery Date",
        render: (row: TOrder) => {
            const deliveryDate = new Date(row.deliveryDate!).toLocaleDateString();
            const deliveryWindow = `${row.deliveryStartTime} - ${row.deliveryEndTime}`;
            return (
                <div className="flex flex-col gap-1 items-start text-gray-500">
                    <p>{withNA(deliveryDate)}</p>
                    <p>{withNA(deliveryWindow)}</p>
                </div>
            )
        }
    },
    {
        key: "orderItems",
        header: "Order Items",
        tooltip: false,
        render: (row: TOrder) => (
            <div className="flex flex-row gap-1 items-center text-gray-500 ">
                <p>{withNA(row.orderItemsCount)}</p>
            </div>
        )
    },
    {
        key: "totalAmount",
        header: "Total",
        render: (row: TOrder) => (
            <div className="flex flex-row gap-1 items-center">
                <p className="font-bold">₹{withNA(row.totalAmount)}</p>
            </div>
        )
    },
    {
        key: "status",
        header: "Status",
        render: (row: TOrder) => (
            <div className="items-start flex">
                <Badge className={cn('cursor-pointer', badgeFields(row?.status as EOrderStatus).textColor, badgeFields(row?.status as EOrderStatus).bgColor)}>
                    {badgeFields(row?.status as EOrderStatus).text}
                </Badge>
            </div>
        ),
    }
];
