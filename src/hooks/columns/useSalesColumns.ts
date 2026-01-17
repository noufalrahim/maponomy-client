import { useMemo } from "react";
import { generateSalesColumns } from "@/columns/SalesColumn";
import { TSalesPerson } from "@/types";

export function useSalesColumns(
  setActionItem: React.Dispatch<React.SetStateAction<TSalesPerson | string | null | undefined>>,
  setOpenResetPasswordWindow: React.Dispatch<React.SetStateAction<boolean>>
) {
  return useMemo(
    () => generateSalesColumns(setActionItem, setOpenResetPasswordWindow),
    [setActionItem, setOpenResetPasswordWindow]
  );
}
