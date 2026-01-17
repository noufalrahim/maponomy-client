/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card';
import { TableComponent } from '@/components/Table';
import { EUrl, TOrder, TServiceResponse } from '@/types';
import { orderColumn } from '@/columns/OrderColumn';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { QuerySpec } from '@/lib/query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DialogModal } from '@/components/DialogModal';
import { useModifyData } from '@/hooks/useModifyData';
import OrderForm, { OrderFormValues } from './OrderForm';
import { offsetCalculator } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const END_POINT = '/orders';

export default function Orders() {

    const navigate = useNavigate();
    const [actionItem, setActionItem] = useState<TOrder | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 0,
    });

    const user = useSelector((state: RootState) => state.user.entity);

    const { data: res, isFetching, isError, error, refetch } =
        useReadDataWithBody<TServiceResponse<TOrder[]>, QuerySpec>(
            "order_list_fetch",
            `${END_POINT}/query`,
            {
                where: {
                    and: [
                        {
                            field: "createdBy",
                            op: "eq",
                            value: user?.id
                        }
                    ]
                },
                sort: [
                    {
                        field: "createdAt",
                        direction: "desc"
                    }
                ],
                limit: pagination?.pageSize,
                offset: offsetCalculator(pagination)
            }
        );

    const { mutate: updateOrder, isPending } = useModifyData<TOrder & {id: string}, TServiceResponse<TOrder>>(END_POINT);

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
        if(!actionItem || !actionItem.id){
            toast.error("An error occured!");
            return;
        }
        const payload: TOrder & {id: string} = {
            id: actionItem.id,
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
                    if(res && res.success){
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

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className='flex flex-col gap-1 items-start'>
                    <h2 className="text-xl font-semibold text-foreground">Orders Management</h2>
                    {
                        res?.count ? <p className="text-muted-foreground">{res?.count} orders</p> : null
                    }
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <TableComponent<TOrder>
                        data={res?.data || []}
                        columns={orderColumn}
                        getRowId={(row) => row.id!}
                        isLoading={isFetching}
                        showActions={{
                            delete: false,
                            edit: (row) => !row.pushedToErp,
                        }}
                        onClickEdit={(row) => {
                            setActionItem(row);
                            setOpen(true);
                        }}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        totalItems={res?.count || 100}
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
                <OrderForm actionItem={actionItem} onSubmit={handleSubmit} loading={isPending} setOpen={setOpen}/>
            </DialogModal>
        </div>
    );
}
