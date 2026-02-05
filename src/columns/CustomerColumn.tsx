
import { TSalesPerson, TCustomer } from "@/types";
import { TColumn } from "@/types";
import { Badge } from "@/components/ui/badge";
import { badgeFields, clamp, cn, withNA } from "@/lib/utils";
import { Building2, Key, MailIcon, MapPin, PhoneIcon, User, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";

export const generateCustomerColumns = (setActionItem: (item: TCustomer | string | null | undefined) => void, setOpenResetPasswordWindow: (open: boolean) => void): TColumn<TCustomer>[] => {
    return (
        [
            {
                key: "id",
                header: "ID",
                render: (row: TCustomer) => (
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <p className="font-semibold">{row.id}</p>
                    </div>
                )
            },
            {
                key: "customer",
                header: "Customer",
                minWidth: 300,
                tooltip: true,
                tooltipValue: (row: TCustomer) => row.name || '',
                render: (row: TCustomer) => (
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <span className="flex items-center justify-center w-10 h-10 rounded-md bg-accent text-accent-foreground">
                            {
                                row.storeImage && row.storeImage != "" ? (
                                    <img src={`${import.meta.env.VITE_STORAGE_API}/images/${row.storeImage}`} alt="" className="w-full h-full object-cover border border-gray-300 rounded-md" />
                                ) : (
                                    <p className="font-bold">{withNA(row?.name?.charAt(0))}</p>
                                )
                            }
                        </span>
                        <div className="flex flex-col items-start">
                            <p className="font-semibold">{withNA(clamp(row?.name, 20))}</p>
                            <div className="flex flex-row text-gray-500 text-sm items-center justify-start">
                                <MapPin size={13} />
                                <p>{withNA(clamp(row?.address, 20))}</p>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                key: "type",
                header: "Type",
                render: (row: TCustomer) => (
                    <div className="items-start flex">
                        <Badge className={cn('cursor-pointer', badgeFields(row?.type).textColor, badgeFields(row?.type).bgColor)}>
                            <Building2 size={13} />
                            {badgeFields(row?.type).text}
                        </Badge>
                    </div>
                ),
            },
            {
                key: "name",
                header: "Contact",
                tooltip: true,
                tooltipValue: (row: TCustomer) => `${row?.phoneNumber}, ${row?.user?.email}`,
                render: (row: TCustomer) => {
                    return (
                        <div className="flex flex-col gap-1 items-start text-gray-500 ">
                            <div className="flex flex-row items-center gap-1">
                                <PhoneIcon size={13} />
                            <p>{withNA(row?.phoneNumber)}</p>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <MailIcon size={13}/>
                                <p>{withNA(row?.user?.email)}</p> 
                            </div>
                        </div>
                    )
                }
            },
            {
                key: "warehouseId",
                header: "Warehouse",
                tooltip: true,
                tooltipValue: (row: TCustomer) => row.warehouseId?.name || '',
                render: (row: TCustomer) => (
                    <div className="flex flex-row gap-1 items-center text-gray-500 ">
                        <Warehouse size={13} />
                        <p>{withNA(row?.warehouseId?.name)}</p>
                    </div>
                )
            },
            {
                key: "salespersonId",
                header: "Assigned To (Sales Rep)",
                tooltip: true,
                tooltipValue: (row: TCustomer) => row.salespersonId?.[0]?.name || '',
                render: (row: TCustomer) => (
                    <div className="flex flex-row gap-1 items-center text-gray-500">
                        <User size={13} />
                        <p>{withNA(row.salespersonId?.[0]?.name)}</p>
                    </div>
                )
            },
            {
                key: "orders",
                header: "Orders",
                render: (row: TCustomer) => (
                    <p className="text-start">{row.orderCount}</p>
                ),
            },
            {
                key: "totalValue",
                header: "Total Value",
                render: (row: TCustomer) => (
                    <p className="text-start px-5 font-bold">₹{row.totalOrderValue}</p>
                ),
            },
            {
                key: "active",
                header: "Status",
                tooltip: false,
                render: (row: TCustomer) => (
                    <div className="items-start flex">
                        <Badge className={cn('cursor-pointer', badgeFields(row?.active ? 'active' : 'inactive').textColor, badgeFields(row?.active ? 'active' : 'inactive').bgColor)}>
                            {badgeFields(row?.active ? 'active' : 'inactive').text}
                        </Badge>
                    </div>
                ),
            },
            {
                key: "Reset Password",
                header: "Reset Password",
                render: (row: TSalesPerson) => (
                    <Button
                        onClick={() => {
                            setActionItem(row.id)
                            setOpenResetPasswordWindow(true)
                        }}
                        variant="ghost"
                        className="flex justify-center items-center"
                    >
                        <Key />
                        <span>Reset Password</span>
                    </Button>
                ),
            }
        ]
    )
}