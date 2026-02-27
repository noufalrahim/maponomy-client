import { useMemo } from "react";
import { orderColumn } from "@/columns/OrderColumn";

export function useOrderColumns() {
    return useMemo(() => orderColumn, []);
}
