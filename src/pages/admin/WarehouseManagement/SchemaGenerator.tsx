import { FormFieldSchema } from '@/components/DynamicForm';
import { WarehouseSchema } from './WarehouseSchema';


export const warehouseSchemaGenerator = (): FormFieldSchema<WarehouseSchema>[] => {
    return [
        {
            name: "name",
            label: "Name",
            control: "text",
            placeholder: "Enter warehouse name",
            validation: {
                required: true,
                minLength: 1
            }
        },
        {
            name: "address",
            label: "Address",
            control: "text",
            placeholder: "Enter warehouse address",
            validation: {
                required: true,
                minLength: 1
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
            name: "active",
            label: "Active",
            control: "dropdown",
            placeholder: 'Active Status',
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
        }
    ]
}
