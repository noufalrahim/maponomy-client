/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { TableComponent } from '@/components/Table';
import { EUrl, TSalesPerson, TServiceResponse, TWarehouse, WarehouseDTO } from '@/types';
import { DialogModal } from '@/components/DialogModal';
import { DynamicForm } from '@/components/DynamicForm';
import { warehouseColumn } from '@/columns/WarehouseColumn';
import { WarehouseSchema } from './WarehouseSchema';
import { toast } from 'sonner';
import { useCreateData } from '@/hooks/useCreateData';
import { warehouseSchemaGenerator } from './SchemaGenerator';
import { useDeleteData } from '@/hooks/useDeleteData';
import { useModifyData } from '@/hooks/useModifyData';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { QuerySpec } from '@/lib/query';
import { queryBuilder } from './queryBuilder';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { useGeocoding } from '@/hooks/useGeocoding';

const END_POINT = '/warehouses';

export default function WarehouseManagement() {

    const [open, setOpen] = useState<boolean>(false);
    const [actionItem, setActionItem] = useState<TWarehouse | string | null>(null);
    const [openWarn, setOpenWarn] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 0,
    });
    const [location, setLocation] = useState<{
        lat: number;
        long: number;
    }>();
    const [searchTerm, setSearchTerm] = useState<string>('');

    const debouncedSearch = useDebounce(searchTerm, 300);
    

    const navigate = useNavigate();

    const geocoding = useGeocoding();

    const { data: res, isFetching, refetch, isError, error } =
        useReadDataWithBody<TServiceResponse<TWarehouse[]>, QuerySpec>(
            "warehouse_list_fetch",
            `${END_POINT}/query`,
            queryBuilder(pagination, debouncedSearch)
        );

    const { mutate: createWarehouse, isPending: createWarehousePending } = useCreateData<WarehouseDTO, TServiceResponse<TWarehouse>>(END_POINT);
    const { mutate: deleteWarehouse, isPending: deleteWarehousePending } = useDeleteData<TServiceResponse<void>>(END_POINT);
    const { mutate: updateWarehouse, isPending: updateWarehousePending } = useModifyData<WarehouseDTO & { id: string }, TServiceResponse<TWarehouse>>(END_POINT);

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
    

    const handleSubmit = async (data: WarehouseSchema) => {
        if (actionItem) {
            if (!(actionItem as TWarehouse).id) {
                toast.error("An unknown error occured");
                return;
            }
            updateWarehouse(
                {
                    id: (actionItem as TWarehouse).id!,
                    ...data,
                    active: data.active === "true",
                    latitude: parseFloat(data?.latitude),
                    longitude: parseFloat(data?.longitude)
                },
                {
                    onSuccess: () => {
                        toast.success("Warehouse updated successfully");
                        refetch();
                        setOpen(false);
                    },
                    onError: (err) => {
                        toast.error(err.message || "Something went wrong")
                    }
                }
            )
        }
        else {
            createWarehouse(
                {
                    ...data,
                    active: data.active === "true",
                    latitude: parseFloat(data?.latitude),
                    longitude: parseFloat(data?.longitude)
                },
                {
                    onSuccess: () => {
                        toast.success("Warehouse added successfully");
                        refetch();
                        setOpen(false);
                    },
                    onError: (err) => {
                        toast.error(err.message || "Something went wrong")
                    }
                }
            )
        }
    }

    const handleDelete = async () => {
        deleteWarehouse({
            id: actionItem as string
        }, {
            onSuccess: (res) => {
                if (res && res.success) {
                    toast.success('Warehouse deleted successfully')
                    refetch()
                    setOpenWarn(false)
                }
            },
            onError: (err) => {
                console.log('An error occured! ', err);
                toast.error(err.message ?? 'An unknown error occured');
            }
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className='flex flex-col gap-1 items-start'>
                    <h2 className="text-xl font-semibold text-foreground">Warehouse Management</h2>
                    {
                        res?.count ? <p className="text-muted-foreground">{res?.count} warehouses</p> : null
                    }
                </div>
                <Button onClick={() => {
                    setActionItem(null)
                    setOpen(true)
                }}>
                    <Plus className="h-4 w-4" />
                    Add Warehouse
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by warehouse name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <TableComponent<TWarehouse>
                        data={res?.data}
                        columns={warehouseColumn}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        totalItems={res?.count || 100}
                        getRowId={(row) => row.id!}
                        onClickDelete={(row) => {
                            console.log("Row: ", row);
                            setActionItem(row)
                            setOpenWarn(true)
                        }}
                        onClickEdit={(row) => {
                            console.log("Row: ", row);
                            setActionItem(row)
                            setOpen(true)
                        }}
                        isLoading={isFetching}
                    />
                </CardContent>
            </Card>
            <DialogModal
                open={open}
                onOpenChange={setOpen}
                title="Add Warehouse"
                description="Add a new warehouse. You can map vendors to this warehouse when adding or editing vendors."
            >
                <DynamicForm<WarehouseSchema>
                    schema={warehouseSchemaGenerator(geocoding, setLocation)}
                    loading={createWarehousePending || updateWarehousePending}
                    onSubmit={(data) => handleSubmit(data)}
                    formValues={{
                        latitude: location?.lat?.toString(),
                        longitude: location?.long?.toString()
                    }}
                    defaultValues={
                        {
                            name: (actionItem as TWarehouse)?.name,
                            address: (actionItem as TWarehouse)?.address,
                            latitude: (actionItem as TWarehouse)?.latitude?.toString(),
                            longitude: (actionItem as TWarehouse)?.longitude?.toString(),
                            active: (actionItem as TSalesPerson)?.active === undefined ? undefined : String((actionItem as TSalesPerson)?.active),
                        }
                    }
                />
            </DialogModal>
            <DialogModal
                open={openWarn}
                onOpenChange={setOpenWarn}
                onConfirm={handleDelete}
                cancelText="Cancel"
                title='Delete Warehouse'
                isDelete={true}
                onCancel={() => setOpenWarn(false)}
                isLoading={deleteWarehousePending}
            >
                <div className='items-center flex flex-col py-5'>
                    <h1>Are you sure you want to delete this warehouse?</h1>
                    <p>This action cannot be undone.</p>
                </div>
            </DialogModal>
        </div>
    );
}
