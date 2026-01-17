import { useMemo } from "react";
import { TCustomer } from "@/types";
import { generateCustomerColumns } from "@/columns/CustomerColumn";

export function useCustomerColumns(
  setActionItem: React.Dispatch<React.SetStateAction<TCustomer | string | null | undefined>>,
  setOpenResetPasswordWindow: React.Dispatch<React.SetStateAction<boolean>>
) {
  return useMemo(
    () => generateCustomerColumns(setActionItem, setOpenResetPasswordWindow),
    [setActionItem, setOpenResetPasswordWindow]
  );
}
