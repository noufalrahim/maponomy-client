import { FormFieldSchema } from '@/components/DynamicForm';
import { WarehouseSchema } from './WarehouseSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Loader2 } from 'lucide-react';


export const warehouseSchemaGenerator = (
    geocoding: {
    places: { formatted_address: string, lat: number, lon: number }[];
    loading: boolean;
    search: (q: string) => void;
  },
  setLocation: (location: { lat: number; long: number }) => void
): FormFieldSchema<WarehouseSchema>[] => {
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
            render: ({ form }) => {
                const { register, setValue, watch } = form;
                const value = watch("address") ?? "";

                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2 items-center">
                            <Input {...register("address")} placeholder='Enter address'/>
                            <Button
                                type="button"
                                className="shadow-xs"
                                onClick={() => geocoding?.search(value)}
                                disabled={geocoding?.loading}
                            >
                                {
                                    geocoding?.loading ? <Loader2 className="animate-spin"/> : ('Search')
                                }
                            </Button>
                        </div>

                        {(geocoding?.places?.length !== undefined && geocoding?.places?.length > 0) ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {"Select an address"}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="w-[300px]">
                                    {geocoding?.places.map((option) => (
                                        <DropdownMenuItem
                                            key={option.formatted_address}
                                            onClick={() => {
                                                setValue("address", option.formatted_address, {
                                                    shouldDirty: true,
                                                    shouldValidate: true
                                                });
                                                 setLocation({ lat: option.lat, long: option.lon });
                                                
                                                form.setValue("latitude", String(option.lat), {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });

                                                form.setValue("longitude", String(option.lon), {
                                                    shouldDirty: true,
                                                    shouldValidate: true,
                                                });
                                            }}    
                                        >
                                            {option.formatted_address}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : geocoding?.places.length === 0 ? (
                            <p className="text-red-500 text-xs text-center italic">No results found</p>
                        ) : null}
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
