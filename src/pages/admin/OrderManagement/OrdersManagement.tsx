/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card';
import { TableComponent } from '@/components/Table';
import { EOrderStatus, EUrl, TOrder, TServiceResponse } from '@/types';
import { orderColumn } from '@/columns/OrderColumn';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { QuerySpec } from '@/lib/query';
import { queryBuilder } from './queryBuilder';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DialogModal } from '@/components/DialogModal';
import OrderForm, { OrderFormValues } from './OrderForm';
import { useModifyData } from '@/hooks/useModifyData';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Upload } from 'lucide-react';
import { useCreateData } from '@/hooks/useCreateData';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import OrderFilters from './OrderFilter';
import { DateRange } from 'react-day-picker';

const END_POINT = '/orders';

export default function OrdersManagement() {

    const navigate = useNavigate();

    const [actionItem, setActionItem] = useState<TOrder | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [openWarn, setOpenWarn] = useState<boolean>(false);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [pushedToErpOnly, setPushedToErpOnly] = useState<boolean>(false);

    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 0,
    });
    const [searchTerm, setSearchTerm] = useState<string>('');

    const debouncedSearch = useDebounce(searchTerm, 300);

    const { data: res, isFetching, isError, error, refetch } =
        useReadDataWithBody<TServiceResponse<TOrder[]>, QuerySpec>(
            "order_list_fetch",
            `${END_POINT}/query`,
            queryBuilder(pagination, debouncedSearch, {
                statuses,
                dateRange,
                pushedToErpOnly
            })
        );

    const { mutate: updateOrder, isPending } = useModifyData<TOrder & { id: string }, TServiceResponse<TOrder>>(END_POINT);
    const { mutate: pushToErpMutate, isPending: pushToErpPending } = useCreateData<string[], TServiceResponse<TOrder[]>>(`${END_POINT}/push-to-erp`);

    const ordersToPushToErp = res?.data?.filter((order) => !order.pushedToErp && order.status === EOrderStatus.CONFIRMED).map((order) => order.id!);

    if (isError) {
        const status = (error as any)?.response?.status || (error as any)?.status;
        if (status === 401 || status === 403) {
            toast.error('You are not authorized to access this page');
            navigate(EUrl.ADMIN_LOGIN);
        }
        else {
            toast.error(error?.message ?? 'An unknown error occured');
        }
    }

    const handleSubmit = async (data: OrderFormValues) => {
        console.log("Data: ", data);
        if (!actionItem || !actionItem.id) {
            toast.error("An error occured!");
            return;
        }
        const payload: TOrder & { id: string } = {
            id: actionItem.id,
            status: data.status,
            deliveryDate: data.deliveryDate,
            deliveryStartTime: data.deliveryStartTime,
            deliveryEndTime: data.deliveryEndTime,
            orderItems: data?.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.price,
            }))

        };
        updateOrder(
            payload,
            {
                onSuccess: (res) => {
                    if (res && res.success) {
                        toast.success("Order updated successfully");
                        setOpen(false);
                        refetch();
                    }
                },
                onError: (error) => {
                    toast.error(error?.message ?? "An unknown error occured");
                }
            }
        );
    };

    const handlePushToErp = async () => {
        if (!ordersToPushToErp || ordersToPushToErp.length === 0) {
            toast.error("No orders to push to ERP!");
            return;
        }
        pushToErpMutate(
            ordersToPushToErp,
            {
                onSuccess: (res) => {
                    if (res && res.success && res.data) {
                        toast.success(`${res.data.length} Orders pushed to ERP successfully`);
                        refetch();
                        setOpenWarn(false);
                    }
                },
                onError: (error) => {
                    toast.error(error?.message ?? "An unknown error occured");
                }
            }
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className='flex flex-col gap-1 items-start'>
                    <h2 className="text-xl font-semibold text-foreground">Orders Management</h2>
                    {
                        res?.count ? <p className="text-muted-foreground">{res?.count} orders</p> : null
                    }
                </div>
                <div className='flex flex-row items-center justify-center gap-3'>
                    <Button onClick={() => setOpenWarn(true)} disabled={pushToErpPending || !ordersToPushToErp || ordersToPushToErp.length === 0}>
                        {
                            pushToErpPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Pushing to ERP...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Push to ERP
                                </>
                            )
                        }
                    </Button>
                </div>
            </div>

            <div className='flex flex-row items-center justify-between gap-3'>
                <div className="relative max-w-xl">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-96"
                    />
                </div>
                <div>
                    <OrderFilters 
                        statuses={statuses}
                        setStatuses={setStatuses}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        pushedToErpOnly={pushedToErpOnly}
                        setPushedToErpOnly={setPushedToErpOnly}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <TableComponent<TOrder>
                        data={res?.data || []}
                        columns={orderColumn}
                        getRowId={(row) => row.id!}
                        showActions={{
                            delete: false,
                            edit: (row) => !row.pushedToErp || row.status === EOrderStatus.PENDING,
                        }}
                        onClickEdit={(row) => {
                            setActionItem(row);
                            setOpen(true);
                        }}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        totalItems={res?.count || 100}
                        isLoading={isFetching}
                    />
                </CardContent>
            </Card>
            <DialogModal
                open={open}
                onOpenChange={setOpen}
                title="Edit Order"
                description="Edit order details"
                width='w-[700px]'
            >
                <OrderForm actionItem={actionItem} onSubmit={handleSubmit} loading={isPending} setOpen={setOpen} />
            </DialogModal>
            <DialogModal
                open={openWarn}
                onOpenChange={setOpenWarn}
                title="Push to ERP"
                onConfirm={handlePushToErp}
                cancelText="Cancel"
                confirmText="Push to ERP"
                onCancel={() => setOpenWarn(false)}
                isLoading={pushToErpPending}
            >
                <div className='items-center flex flex-col py-5'>
                    <h1>Are you sure you want to push all {ordersToPushToErp?.length} confirmed order(s) to ERP?</h1>
                    <p>This action cannot be undone.</p>
                </div>
            </DialogModal>
        </div>
    );
}
