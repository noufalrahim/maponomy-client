/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Eye, EyeOff, Plus, Search } from 'lucide-react';
import { TableComponent } from '@/components/Table';
import { EUrl, TSalesPerson, TServiceResponse, TCustomer, TWarehouse } from '@/types';
import { DialogModal } from '@/components/DialogModal';
import { DynamicForm } from '@/components/DynamicForm';
import { useSchemaGenerator } from './SchemaGenerator';
import { useCreateData } from '@/hooks/useCreateData';
import { useReadData } from '@/hooks/useReadData';
import { CustomerSchema } from './CustomerSchema';
import { toast } from 'sonner';
import { useDeleteData } from '@/hooks/useDeleteData';
import { useModifyData } from '@/hooks/useModifyData';
import { useNavigate } from 'react-router-dom';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { queryBuilder } from './queryBuilder';
import { QuerySpec } from '@/lib/query';
import { CreateCustomerDTO } from '@/types/dto/VendorDTO';
import { randomGenerator } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { useCustomerColumns } from '@/hooks/columns/useCustomerColumns';
import { uploadData } from '@/api/services/uploadData';
import { useGeocoding } from '@/hooks/useGeocoding';

const SALES_REP_ENDPOINT = '/salespersons';
const WAREHOUSE_END_POINT = '/warehouses';
const END_POINT = '/vendors';

export default function VendorManagement() {

    const navigate = useNavigate();

    const [open, setOpen] = useState<boolean>(false);
    const [actionItem, setActionItem] = useState<TCustomer | string | null | undefined>(null);
    const [openWarn, setOpenWarn] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 0,
    });
    const [show, setShow] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [openPasswordWindow, setOpenPasswordWindow] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openResetPasswordWindow, setOpenResetPasswordWindow] = useState<boolean>(false);
    const [uploading, setUplaoding] = useState<boolean>(false);
    const [location, setLocation] = useState<{
        lat: number;
        long: number;
    }>();

    const debouncedSearch = useDebounce(searchTerm, 500);

    const geocoding = useGeocoding();

    console.log("Geocodeing, : ", geocoding);

    const columns = useCustomerColumns(setActionItem, setOpenResetPasswordWindow);

    const { data: res, isFetching, refetch, isError, error } =
        useReadDataWithBody<TServiceResponse<TCustomer[]>, QuerySpec>(
            "vendor_list_fetch",
            `${END_POINT}/query`,
            queryBuilder(pagination, debouncedSearch)
        );

    const { data: salespersonRes, isFetching: salespersonFetching } = useReadData<TServiceResponse<TSalesPerson[]>>('salesperson_list_fetch', SALES_REP_ENDPOINT);
    const { data: warehouseRes, isFetching: warehouseLoading } = useReadData<TServiceResponse<TWarehouse[]>>('warehouse_list_fetch', WAREHOUSE_END_POINT);

    const { mutate: createVendor, isPending: createVendorPending } = useCreateData<CreateCustomerDTO, TServiceResponse<TCustomer>>(END_POINT);
    const { mutate: deleteVendor, isPending: deleteVendorPending } = useDeleteData<TServiceResponse<void>>(END_POINT);
    const { mutate: updateVendor, isPending: updateVendorPending } = useModifyData<CreateCustomerDTO & { id: string }, TServiceResponse<TCustomer>>(END_POINT);
    const { mutate: resetPassword, isPending: resetPasswordPending } = useCreateData<{
        customerId: string;
        password: string;
    }, TServiceResponse<TCustomer>>(`${END_POINT}/reset-password`);

    const schema = useSchemaGenerator(salespersonFetching, warehouseLoading, !!actionItem, setShow, show, setPassword, randomGenerator, setLocation, salespersonRes, warehouseRes, geocoding)

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

    const handleSubmit = async (
        data:
            | CustomerSchema
            | {
                data: CustomerSchema;
                files: FormData;
            }
    ) => {
        let payload: CreateCustomerDTO;

        if ("files" in data) {
            setUplaoding(true);
            const uploadRes = await uploadData<
                TServiceResponse<{
                    key: string;
                    url: string;
                }>
            >("/uploads/images", data.files);

            if (!uploadRes || !uploadRes.success || !uploadRes.data?.url) {
                toast.error(uploadRes?.message ?? "Could not upload image");
                return;
            }

            payload = {
                ...data.data,
                active: data.data.active === "true",
                latitude: parseFloat(data.data.latitude),
                longitude: parseFloat(data.data.longitude),
                storeImage: uploadRes.data.key,
            };
        } else {
            payload = {
                ...data,
                active: data.active === "true",
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                storeImage: data.storeImage ?? "",
            };
        }
        setUplaoding(false);
        if (actionItem) {
            if (!(actionItem as TCustomer).id) {
                toast.error("An unknown error occurred");
                return;
            }

            updateVendor(
                {
                    id: (actionItem as TCustomer).id!,
                    ...payload,
                },
                {
                    onSuccess: (res) => {
                        if (res?.success) {
                            toast.success("Customer updated successfully");
                            refetch();
                            setOpen(false);
                        }
                    },
                    onError: (err) => {
                        console.log("An error occurred!", err);
                        toast.error(err.message ?? "An unknown error occurred");
                    },
                }
            );
        } else {
            createVendor(payload, {
                onSuccess: (res) => {
                    if (res?.success) {
                        toast.success("Customer added successfully");
                        refetch();
                        setOpen(false);
                        setOpenPasswordWindow(true);
                        setPassword(payload.password);
                    }
                },
                onError: (err) => {
                    console.log("An error occurred!", err);
                    toast.error(err.message ?? "An unknown error occurred");
                },
            });
        }
    };


    const handleDelete = async () => {
        deleteVendor({
            id: actionItem as string
        }, {
            onSuccess: (res) => {
                if (res && res.success) {
                    toast.success('Customer deleted successfully')
                    refetch()
                    setOpenWarn(false)
                }
            },
            onError: (err) => {
                console.log('An error occured! ', err);
                toast.error(err.message ?? 'An unknown error occured');
            }
        })
    };

    const handleResetPassword = async ({ password }: { password: string }) => {
        resetPassword(
            {
                customerId: actionItem as string,
                password: password
            },
            {
                onSuccess: (res) => {
                    if (res && res.success) {
                        toast.success('Password reset successfully')
                        setPassword(password)
                        setOpenResetPasswordWindow(false)
                        setOpenPasswordWindow(true)

                    }
                },
                onError: (err) => {
                    console.log('An error occured! ', err);
                    toast.error(err.message ?? 'An unknown error occured');
                }
            }
        )
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(password)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    };

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className='flex flex-col gap-1 items-start'>
                    <h2 className="text-xl font-semibold text-foreground">Customer Management</h2>
                    {
                        res?.count ? <p className="text-muted-foreground">{res?.count} customers</p> : null
                    }
                </div>
                <Button onClick={() => {
                    setActionItem(null)
                    setOpen(true)
                }}>
                    <Plus className="h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <TableComponent<TCustomer>
                        data={res?.data}
                        columns={columns}
                        getRowId={(row) => row.id!}
                        onClickDelete={(row) => {
                            console.log("Row: ", row);
                            setActionItem(row)
                            setOpenWarn(true)
                        }}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        totalItems={res?.count || 100}
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
                title="Add Customer"
                description="Create a customer here. You can manage customer infos."
            >
                <DynamicForm<CustomerSchema>
                    schema={schema}
                    onSubmit={(data) => handleSubmit(data)}
                    isEdit={!!actionItem}
                    defaultValues={
                        {
                            name: (actionItem as TCustomer)?.name,
                            address: (actionItem as TCustomer)?.address,
                            phoneNumber: (actionItem as TCustomer)?.phoneNumber,
                            salespersonId: (actionItem as TCustomer)?.salespersonId?.[0]?.id ?? undefined,
                            warehouseId: (actionItem as TCustomer)?.warehouseId?.id ?? undefined,
                            active: (actionItem as TSalesPerson)?.active === undefined ? undefined : String((actionItem as TSalesPerson)?.active),
                            email: (actionItem as TCustomer)?.user?.email,
                            password: (actionItem as TCustomer)?.user?.password,
                            latitude: (actionItem as TCustomer)?.latitude?.toString() ?? undefined,
                            longitude: (actionItem as TCustomer)?.longitude?.toString() ?? undefined,
                            storeImage: (actionItem as TCustomer)?.storeImage ? `${import.meta.env.VITE_STORAGE_API}/images/${(actionItem as TCustomer)?.storeImage}` : undefined,
                            type: (actionItem as TCustomer)?.type
                        }
                    }
                    loading={createVendorPending || updateVendorPending || uploading}
                />
            </DialogModal>
            <DialogModal
                open={openWarn}
                onOpenChange={setOpenWarn}
                onConfirm={handleDelete}
                cancelText="Cancel"
                title='Delete Customer'
                isDelete={true}
                onCancel={() => setOpenWarn(false)}
                isLoading={deleteVendorPending}
            >
                <div className='items-center flex flex-col py-5'>
                    <h1>Are you sure you want to delete this customer?</h1>
                    <p>This action cannot be undone.</p>
                </div>
            </DialogModal>
            <DialogModal
                open={openPasswordWindow}
                onOpenChange={setOpenPasswordWindow}
                title='Password'
                description="Share these credentials with Test. The password won't be shown again"
                onConfirm={() => {
                    setPassword('')
                    setOpenPasswordWindow(false)
                }}
                onCancel={() => {
                    setPassword('')
                    setOpenPasswordWindow(false)
                }}
                confirmText='Done'
            >
                <div className='bg-accent p-5 border border-border rounded-md'>
                    <div>
                        <p className='text-sm'>Customer Password</p>
                        <p className='text-xs text-muted-foreground'>Share these credentials with Customer. The password won't be shown again.</p>
                    </div>
                    <div className='flex gap-2 flex-col pt-5'>
                        <div className='bg-white p-2 border rounded-md flex items-center gap-2 justify-between'>
                            <div className='flex items-center gap-2'>
                                <p>Password:</p>
                                <p>{password}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal>
            <DialogModal
                open={openResetPasswordWindow}
                onOpenChange={setOpenResetPasswordWindow}
                cancelText="Cancel"
                title='Reset Password'
                description='Reset password. The new password will be shown once.'
            >
                <DynamicForm<{
                    password: string
                }>
                    schema={
                        [
                            {
                                name: "password",
                                label: "Password",
                                control: "text",
                                validation: {
                                    required: true,
                                    minLength: 6
                                },
                                render: ({ form }) => {
                                    const { register, setValue, getValues } = form;
                                    const value = getValues("password") ?? "";
                                    return (
                                        <div className="flex gap-2 items-center">
                                            <div className="relative w-full">
                                                <Input
                                                    type={show ? "text" : "password"}
                                                    {...register("password")}
                                                    value={value}
                                                    onChange={(e) => {
                                                        setValue("password", e.target.value, { shouldValidate: true })
                                                    }}
                                                    className="pr-10"
                                                    placeholder={"Enter a strong password"}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShow(!show)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                >
                                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setValue("password", randomGenerator({ length: 10 }), { shouldValidate: true })
                                                }
                                            >
                                                Generate
                                            </Button>
                                        </div>
                                    );
                                }
                            }
                        ]
                    }
                    onSubmit={(data: {
                        password: string
                    }) => handleResetPassword(data)}
                    loading={resetPasswordPending}
                />
            </DialogModal>
        </div>
    );
}
