import { useMemo } from "react";
import { warehouseColumn } from "@/columns/WarehouseColumn";

export function useWarehouseColumns() {
    return useMemo(() => warehouseColumn, []);
}
