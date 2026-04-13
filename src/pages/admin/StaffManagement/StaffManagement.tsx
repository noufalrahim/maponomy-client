import { Card, CardContent } from "@/components/ui/card";
import { TableComponent } from "@/components/Table";
import { ERole, TServiceResponse, TUser } from "@/types";
import { useReadDataWithBody } from "@/hooks/useReadDataWithBody";
import { QuerySpec } from "@/lib/query";
import { toast } from "sonner";
  // removed useNavigate
import { useState } from "react";
import { DialogModal } from "@/components/DialogModal";
import { useModifyData } from "@/hooks/useModifyData";
import { useCreateData } from "@/hooks/useCreateData";
import { FormFieldSchema } from "@/components/DynamicForm";
import DynamicForm from "@/components/DynamicForm/DynamicForm";
import { TColumn } from "@/types";
// import { z } removed
import { useReadData } from "@/hooks/useReadData";
import { TWarehouse } from "@/types/TWarehouse";
import { Plus, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { randomGenerator } from "@/lib/utils";

const END_POINT = "/users";

export default function StaffManagement() {
  // navigate removed

  const [open, setOpen] = useState<boolean>(false);
  const [actionItem, setActionItem] = useState<TUser | null>(null);

  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: warehousesRes } = useReadData<TServiceResponse<TWarehouse[]>>(
    "warehouses",
    "/warehouses"
  );

  const { data: res, isFetching, isError, error, refetch } =
    useReadDataWithBody<TServiceResponse<TUser[]>, QuerySpec>(
      "staff_list_fetch",
      `${END_POINT}/query`,
      {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        where: {
          and: [
            { field: "role", op: "eq", value: ERole.ADMIN },
            ...(debouncedSearch ? [{
               or: [
                 { field: "email", op: "like" as const, value: debouncedSearch }
               ]
            }] : [])
          ]
        }
      }
    );

  const { mutate: updateUser, isPending: isUpdating } = useModifyData<Partial<TUser> & { id: string }, TServiceResponse<TUser>>(END_POINT);
  // register API doesn't allow warehouse managers natively maybe? wait, POST /auth/signup or POST /users ?
  // POST /users is generic CRUD which works. Wait, generic CRUD might not hash passwords if not overridden!
  // Let's use auth register endpoint or handle password hashing.
  // Actually, we can use /users generic route, but wait, does it hash? The generic route just does `insert`. It doesn't hash password!
  const { mutate: createUser, isPending: isCreating } = useCreateData<any, TServiceResponse<any>>("/auth/signup");

  if (isError) {
    toast.error(error?.message ?? "An unknown error occured");
  }

  const columns: TColumn<TUser>[] = [
    {
      key: "email",
      header: "Email",
    },
    {
      key: "role",
      header: "Role",
    },
    {
      key: "warehouseId",
      header: "Warehouse ID",
      render: (row) => {
        const matchingWarehouse = warehousesRes?.data?.find(w => w.id === row.warehouseId);
        return matchingWarehouse ? matchingWarehouse.name : row.warehouseId ?? "-";
      }
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {row.isActive ? 'Active' : 'Inactive'}
          </span>
      )
    }
  ];

  const handleSubmit = (data: any) => {
    if (actionItem?.id) {
       // Update
       updateUser(
         { id: actionItem.id, isActive: data.isActive === 'true', warehouseId: data.warehouseId },
         {
           onSuccess: () => {
             toast.success("Admin updated");
             setOpen(false);
             refetch();
           }
         }
       );
    } else {
       // Create via Auth register
       createUser(
         { email: data.email, password: data.password, role: ERole.ADMIN },
         {
           onSuccess: (res: any) => {
             if(res?.success) {
               // Update it with warehouse Id
               if (data.warehouseId && res.data?.user?.id) {
                 updateUser({ id: res.data.user.id, warehouseId: data.warehouseId }, {
                    onSuccess: () => {
                      toast.success("Admin created");
                      setOpen(false);
                      refetch();
                    }
                 });
               } else {
                 toast.success("Admin created");
                 setOpen(false);
                 refetch();
               }
             }
           },
           onError: (err) => {
             toast.error(err.message || "Failed to create admin");
           }
         }
       );
    }
  };

  const schema: FormFieldSchema<any>[] = [
    {
      name: "email",
      label: "Email",
      control: "text",
      validation: { required: true },
      hidden: !!actionItem?.id
    },
    {
      name: "password",
      label: "Password",
      control: "text",
      validation: { required: !actionItem?.id },
      hidden: !!actionItem?.id,
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
    },
    {
      name: "role",
      control: "text",
      hidden: true,
      defaultValue: ERole.ADMIN
    },
    {
      name: "isActive",
      label: "Status",
      control: "dropdown",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" }
      ],
      validation: { required: true },
      hidden: !actionItem?.id
    }
  ];

  // validator unused

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col gap-1 items-start">
          <h2 className="text-xl font-semibold text-foreground">Admin Management</h2>
          {res?.count ? <p className="text-muted-foreground">{res?.count} admin(s)</p> : null}
        </div>
        <Button onClick={() => {
            setActionItem(null);
            setOpen(true);
        }}>
            <Plus className="h-4 w-4" />
            Add Admin
        </Button>
      </div>

      <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
          />
      </div>
      <Card>
        <CardContent className="p-0">
          <TableComponent<TUser>
            data={res?.data || []}
            columns={columns}
            getRowId={(row) => row.id!}
            showActions={{
              delete: false,
              edit: true,
            }}
            onClickEdit={(row) => {
              setActionItem(row);
              setOpen(true);
            }}
            // onAddNew removed
            pagination={pagination}
            onPaginationChange={setPagination}
            totalItems={res?.count || 10}
            isLoading={isFetching}
          />
        </CardContent>
      </Card>
      <DialogModal
        open={open}
        onOpenChange={setOpen}
        title={actionItem?.id ? "Edit Staff" : "Add Staff"}
        description="Manage staff access"
        width="w-[500px]"
      >
        <DynamicForm
          schema={schema}
          onSubmit={handleSubmit}
          defaultValues={actionItem ? {
             warehouseId: actionItem.warehouseId,
             isActive: String(actionItem.isActive)
          } : {}}
          loading={isUpdating || isCreating}
        />
      </DialogModal>
    </div>
  );
}
