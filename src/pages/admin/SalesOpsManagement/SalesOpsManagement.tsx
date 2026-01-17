/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Eye, EyeOff, Plus, Search } from 'lucide-react';
import { TableComponent } from '@/components/Table';
import { EUrl, SalesPersonCreateDTO, SalesPersonEditDTO, TSalesPerson, TServiceResponse } from '@/types';
import { DialogModal } from '@/components/DialogModal';
import { DynamicForm } from '@/components/DynamicForm';
import { useCreateData } from '@/hooks/useCreateData';
import { toast } from 'sonner';
import { SalespersonSchema } from './SalespersonSchema';
import { salespersonSchemaGenerator } from './SchemaGenerator';
import { useDeleteData } from '@/hooks/useDeleteData';
import { Input } from '@/components/ui/input';
import { useModifyData } from '@/hooks/useModifyData';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { QuerySpec } from '@/lib/query';
import { queryBuilder } from './queryBuilder';
import { useSalesColumns } from '@/hooks/columns/useSalesColumns';
import { useNavigate } from 'react-router-dom';
import { randomGenerator } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

const END_POINT = '/salespersons';

export default function SalesOpsManagement() {
    const [open, setOpen] = useState<boolean>(false);
    const [openPasswordWindow, setOpenPasswordWindow] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    const [actionItem, setActionItem] = useState<TSalesPerson | string | null | undefined>(null);
    const [openWarn, setOpenWarn] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [openResetPasswordWindow, setOpenResetPasswordWindow] = useState<boolean>(false);
    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 0
    })
    const [searchTerm, setSearchTerm] = useState<string>('');

    const navigate = useNavigate();

    const debouncedSearch = useDebounce(searchTerm, 300);

    const { data: res, isFetching, refetch, error, isError } =
        useReadDataWithBody<TServiceResponse<TSalesPerson[]>, QuerySpec>(
            "salesperson_list_fetch",
            `${END_POINT}/query`,
            queryBuilder(pagination, debouncedSearch)
        );
    const columns = useSalesColumns(setActionItem, setOpenResetPasswordWindow);

    const { mutate, isPending } = useCreateData<SalesPersonCreateDTO, TServiceResponse<TSalesPerson>>(END_POINT);
    const { mutate: deleteSalesperson, isPending: deleteSalespersonPending } = useDeleteData<TServiceResponse<void>>(END_POINT);
    const { mutate: resetPassword, isPending: resetPasswordPending } = useCreateData<{
        salespersonId: string;
        password: string;
    }, TServiceResponse<TSalesPerson>>(`${END_POINT}/reset-password`);
    const { mutate: updateSalesperson, isPending: updateSalespersonPending } = useModifyData<SalesPersonEditDTO, TServiceResponse<TSalesPerson>>(END_POINT);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(password)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    const handleSubmit = async (data: SalespersonSchema) => {
        if (actionItem) {
            if(!(actionItem as TSalesPerson).id){
                toast.error("An unknown error occured");
                return;
            }
            updateSalesperson(
                {
                    ...data,
                    id: (actionItem as TSalesPerson).id!,
                    monthlyTarget: parseFloat(data.monthlyTarget),
                    active: data.active === "true",
                },
                {
                    onSuccess: (res) => {
                        if (res && res.success) {
                            toast.success("Sales Rep updated successfully");
                            refetch();
                            setOpen(false);
                        }
                    },
                    onError: (err) => {
                        console.log("Error: ", err);
                        toast.error(err.message || "Something went wrong")
                    }
                }
            )
        } else {
            mutate(
                {
                    ...data,
                    monthlyTarget: parseFloat(data.monthlyTarget),
                    active: data.active === "true",
                },
                {
                    onSuccess: (res) => {
                        if (res && res.success) {
                            toast.success("Sales Rep added successfully");
                            refetch();
                            setOpen(false);
                            setOpenPasswordWindow(true);
                            setPassword(data.password);
                        }
                    },
                    onError: (err) => {
                        console.log("Error: ", err);
                        toast.error(err.message || "Something went wrong")
                    }
                }
            )
        }
    }

    const handleDelete = async () => {
        deleteSalesperson({
            id: actionItem as string
        }, {
            onSuccess: (res) => {
                if (res && res.success) {
                    toast.success('Sales rep deleted successfully')
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

    const handleResetPassword = async ({ password }: { password: string }) => {
        resetPassword(
            {
                salespersonId: actionItem as string,
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
    }

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

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className='flex flex-col gap-1 items-start'>
                    <h2 className="text-xl font-semibold text-foreground">Sales Representatives</h2>
                    {
                        res?.count ? <p className="text-muted-foreground">{res?.count} sales representative(s)</p> : null
                    }
                </div>
                <Button onClick={() => {
                    setActionItem(null)
                    setOpen(true)
                }}>
                    <Plus className="h-4 w-4" />
                    Add Sales Rep
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by name or mobile number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div> 

            <Card>
                <CardContent className="p-0">
                    <TableComponent<TSalesPerson>
                        data={res?.data || []}
                        columns={columns}
                        getRowId={(row) => row.id!}
                        onClickDelete={(row) => {
                            setActionItem(row)
                            setOpenWarn(true)
                        }}
                        totalItems={res?.count || 100}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onClickEdit={(row) => {
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
                title="Add Sales Rep"
                description="Create a new sales rep account. They'll use these credentials to log in."
            >
                <DynamicForm<SalespersonSchema>
                    schema={salespersonSchemaGenerator(show, setShow, randomGenerator, setPassword, !!actionItem)}
                    onSubmit={(data: SalespersonSchema) => handleSubmit(data)}
                    loading={isPending || updateSalespersonPending}
                    isEdit={!!actionItem}
                    defaultValues={
                        {
                            name: (actionItem as TSalesPerson)?.name,
                            phoneNumber: (actionItem as TSalesPerson)?.phoneNumber,
                            email: (actionItem as TSalesPerson)?.user?.email,
                            monthlyTarget: (actionItem as TSalesPerson)?.monthlyTarget?.toFixed(2),
                            active: (actionItem as TSalesPerson)?.active === undefined ? undefined : String((actionItem as TSalesPerson)?.active),
                            // role: (actionItem as TSalesPerson).role,
                            // status: (actionItem as TSalesPerson).status,
                        }
                    }
                />
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
                        <p className='text-sm'>Sales Representative Password</p>
                        <p className='text-xs text-muted-foreground'>Share these credentials with Tested. The password won't be shown again.</p>
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
                open={openWarn}
                onOpenChange={setOpenWarn}
                onConfirm={handleDelete}
                cancelText="Cancel"
                title='Delete Salesperson'
                isDelete={true}
                onCancel={() => setOpenWarn(false)}
                isLoading={deleteSalespersonPending}
            >
                <div className='items-center flex flex-col py-5'>
                    <h1>Are you sure you want to delete this salesperson?</h1>
                    <p>This action cannot be undone.</p>
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
