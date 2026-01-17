import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { TCategory, TSalesPerson, TServiceResponse } from "@/types";
import { FormFieldSchema } from '@/components/DynamicForm';
import { CustomerSchema } from './CustomerSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


export const customerSchemaGenerator = (
    salespersonLoading: boolean,
    warehouseLoading: boolean,
    isEdit: boolean,
    setShow: (show: boolean) => void,
    show: boolean,
    setPassword: (password: string) => void,
    generatePassword: () => string,
    salespersonRes?: TServiceResponse<TSalesPerson[]>,
    warehouseRes?: TServiceResponse<TCategory[]>,
    
): FormFieldSchema<CustomerSchema>[] => {
    return [
        {
            name: "storeImage",
            label: "Store Image",
            control: "file",
            layout: {
                colSpan: 3
            }
        },
        {
            name: "name",
            label: "Customer Name",
            control: "text",
            placeholder: "Enter customer name",
            validation: {
                required: true,
                maxLength: 100,
                minLength: 1
            },

        },
        {
            name: "type",
            label: "Customer Type",
            control: "dropdown",
            
            options: [
                {
                    label: "External Business (Customer)",
                    value: "external"
                },
                {
                    label: "Own Store (Customer Self)",
                    value: "own"
                }
            ],
            placeholder: 'Select customer type'
        },
        {
            name: "address",
            label: "Address",
            control: "text",
            validation: {
                required: true,
                minLength: 1
            },
            placeholder: 'Enter address'
        },
        {
            name: "phoneNumber",
            label: "Phone Number",
            control: "text",
            constraint: "numericOnly",
            placeholder: "Enter phone number",
            validation: {
                required: true,
                regexMatch: {
                    pattern: /^[1-9][0-9]{9}$/,
                    message: "Phone number must be 10 digits and cannot start with 0",
                },
            },
            layout: {
                colSpan: 6,
            }
        },
        {
            name: "email",
            label: "Email (for portal access)",
            editConstraint: {
                disabled: true,
            },
            control: "text",
            constraint: "email",
            placeholder: "Enter email",
            validation: {
                required: true,
            },
            layout: {
                colSpan: 6,
            }
        },
        {
            name: "password",
            label: "Password",
            control: "text",
            editConstraint: {
                disabled: true,
            },
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
                                    setPassword(e.target.value)
                                }}
                                className="pr-10"
                                placeholder={"Enter a strong password"}
                                disabled={isEdit}
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                disabled={isEdit}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={isEdit}
                            onClick={() =>
                                setValue("password", generatePassword(), { shouldValidate: true })
                            }
                        >
                            Generate
                        </Button>
                    </div>
                );
            }

        },
        {
            name: "latitude",
            label: "Latitude",
            control: "text",
            placeholder: "e.g: 12.55",
            layout: {
                colSpan: 6
            },
            validation: {
                required: true,
                regexMatch: {
                    pattern: /^-?\d+(\.\d+)?$/,
                    message: "Invalid latitude"
                }
            }
        },
        {
            name: "longitude",
            label: "Longitude",
            control: "text",
            placeholder: "e.g: 12.55",
            layout: {
                colSpan: 6
            },
            validation: {
                required: true,
                regexMatch: {
                    pattern: /^-?\d+(\.\d+)?$/,
                    message: "Invalid longitude"
                }
            }
        },
        {
            name: "salespersonId",
            label: "Assign to Sales Rep",
            control: "dropdown",
            render: ({ field, form }) => {
                return (
                    <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => form.setValue(field.name, v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a sales rep" />
                        </SelectTrigger>

                        <SelectContent>
                            {
                                salespersonLoading && (
                                    <div className='text-sm p-3 items-center w-full justify-center flex italic'>
                                        <Loader2 className='animate-spin' />
                                    </div>
                                )
                            }
                            {salespersonRes?.data?.map((ct) => (
                                <SelectItem key={ct.id} value={String(ct.id)}>
                                    {ct.name}
                                </SelectItem>
                            ))}
                            {
                                salespersonRes?.data?.length === 0 && (
                                    <div className='text-sm p-3 items-center w-full justify-center flex italic'>No Sales Reps added yet!</div>
                                )
                            }
                        </SelectContent>

                    </Select>
                );
            }
        },
        {
            name: "warehouseId",
            label: "Assign to Warehouse (optional)",
            control: "dropdown",
            placeholder: "Select warehouse",
            render: ({ field, form }) => {
                return (
                    <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => form.setValue(field.name, v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a warehouse" />
                        </SelectTrigger>

                        <SelectContent>
                            {
                                warehouseLoading && (
                                    <div className='text-sm p-3 items-center w-full justify-center flex italic'>
                                        <Loader2 className='animate-spin' />
                                    </div>
                                )
                            }
                            {warehouseRes?.data?.map((ct) => (
                                <SelectItem key={ct.id} value={String(ct.id)}>
                                    {ct.name}
                                </SelectItem>
                            ))}
                            {
                                warehouseRes?.data?.length === 0 && (
                                    <div className='text-sm p-3 items-center w-full justify-center flex italic'>No warehouse added yet!</div>
                                )
                            }
                        </SelectContent>

                    </Select>
                );
            }
        },
        {
            name: "active",
            label: "Active",
            control: "dropdown",
            placeholder: "Active Status",
            options: [
                {
                    label: "Active",
                    value: "true"
                },
                {
                    label: "Inactive",
                    value: "false"
                }
            ]
        },
    ]
}