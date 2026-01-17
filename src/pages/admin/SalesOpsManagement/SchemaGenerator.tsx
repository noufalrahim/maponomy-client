import { FormFieldSchema } from '@/components/DynamicForm';
import { CategoryDTO } from '@/types/dto/CategoryDTO';
import { SalespersonSchema } from './SalespersonSchema';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';


export const salespersonSchemaGenerator = (
    show: boolean,
    setShow: (show: boolean) => void,
    generatePassword: () => string,
    setPassword: (password: string) => void,
    isEdit: boolean,
): FormFieldSchema<SalespersonSchema>[] => {

    return [
        {
            name: "name",
            label: "Full Name",
            control: "text",
            placeholder: "Enter full name",
            validation: {
                required: true,
                maxLength: 100,
            }

        },
        {
            name: "email",
            label: "Email",
            control: "text",
            constraint: "email",
            placeholder: "Enter email",
            editConstraint: {
                disabled: true,
            },
            validation: {
                required: true,
                maxLength: 100,
                minLength: 1,
                regexMatch: {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email"
                },
            },

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
            ],
            layout: {
                colSpan: 6
            }
        },
        {
            name: "monthlyTarget",
            label: "Monthly Target",
            placeholder: "Enter monthly target",
            control: "number",
            validation: {
                required: true,
                minLength: 2
            },
            layout: {
                colSpan: 6
            }
        }
    ]
}

export const categorySchemaGenerator = (): FormFieldSchema<CategoryDTO>[] => {
    return [
        {
            name: "name",
            label: "Category Name",
            control: "text",
            placeholder: "Enter category name",
            validation: {
                required: true,
                maxLength: 100,
            }
        },
    ]
}