import { useMemo } from "react";
import { productColumn } from "@/columns/ProductColumn";

export function useProductColumns() {
    return useMemo(() => productColumn, []);
}
