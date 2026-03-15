import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Trash } from "lucide-react";
import { TCategory, TServiceResponse } from "@/types";
import { FormFieldSchema } from '@/components/DynamicForm';
import { ProductSchema } from './ProductSchema';
import { CategoryDTO } from '@/types/dto/CategoryDTO';


export const productSchemaGenerator = (
    categoryLoading: boolean,
    setOpen: (open: boolean) => void,
    handleDeleteCategory: (id: string) => void,
    deleteCategoryPending: boolean,
    categoryRes?: TServiceResponse<TCategory[]>,
): FormFieldSchema<ProductSchema>[] => {
    return [
        {
            name: "image",
            label: "Product Image",
            control: "file",
            validation: {
                required: true
            },
            placeholder: 'Upload',
            layout: {
                colSpan: 3
            }
        },
        {
            name: "name",
            label: "Product Name",
            control: "text",
            placeholder: "Enter product name",
            validation: {
                required: true,
                maxLength: 100,
            },

        },
        {
            name: "sku",
            label: "SKU",
            control: "text",
            validation: {
                required: true,
                minLength: 1
            },
            placeholder: 'Enter product SKU'
        },
        {
            name: "categoryId",
            label: "Category",
            control: "dropdown",
            layout: {
                colSpan: 6
            },
            render: ({ field, form }) => {
                return (
                    <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => form.setValue(field.name, v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent>
                            {categoryLoading && (
                                <div className="text-sm p-3 w-full flex justify-center italic">
                                    <Loader2 className="animate-spin" />
                                </div>
                            )}

                            {categoryRes?.data?.map((ct) => (
                                <SelectItem
                                    key={ct.id}
                                    value={String(ct.id)}
                                    className="group relative pr-8"
                                >
                                    <span className="block truncate">{ct.name}</span>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onPointerDown={(e) => {
                                            console.log("Trash icon pointer down for ID: ", ct.id);
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteCategory(ct.id!);
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClickCapture={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        disabled={deleteCategoryPending}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50"
                                    >
                                        {deleteCategoryPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                        ) : (
                                            <Trash className="w-4 h-4 text-destructive" />
                                        )}
                                    </button>
                                </SelectItem>
                            ))}


                            {categoryRes?.data?.length === 0 && (
                                <div className="text-xs p-3 w-full flex justify-center italic">
                                    No Categories added yet!
                                </div>
                            )}

                            <div
                                onClick={() => setOpen(true)}
                                className="border-t p-2 gap-2 flex items-center justify-center cursor-pointer hover:bg-accent"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <p className="text-xs">Add Category</p>
                            </div>
                        </SelectContent>
                    </Select>
                );
            }

        },
        {
            name: "measureUnit",
            label: "Measure Unit",
            control: "text",
            validation: {
                required: true,
                minLength: 1
            },
            placeholder: 'Measuring unit (eg: Kg, g, ml, l, etc.)',
            layout: {
                colSpan: 6
            }
        },
        {
            name: "packageType",
            label: "Packaging Type",
            control: "text",
            validation: {
                required: true,
                minLength: 1
            },
            placeholder: 'Packaging type (eg: Box, Bag, etc.)',
            layout: {
                colSpan: 6
            }
        },
        {
            name: "price",
            label: "Price",
            control: "number",
            validation: {
                required: true,
                minLength: 1,
            },
            placeholder: 'Enter a price',
            layout: {
                colSpan: 6
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