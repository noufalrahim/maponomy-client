import { useMutation } from "@tanstack/react-query";
import { createData } from "@/api/services/createData";

export const useCreateData = <TRequest, TResponse>(url: string) => {
  return useMutation<TResponse, Error, TRequest>({
    mutationFn: (data) => createData<TRequest, TResponse>(url, data),
  });
};
