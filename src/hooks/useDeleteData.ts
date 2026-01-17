import { deleteData } from "@/api/services/deleteData";
import { useMutation } from "@tanstack/react-query";

export const useDeleteData = <TResponse>(url: string) => {
  return useMutation<TResponse, Error, { id: string }>({
    mutationFn: (data: { id: string }) => deleteData<TResponse>(url, data),
  });
};