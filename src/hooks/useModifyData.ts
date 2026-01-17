import { editData } from "@/api/services/updateData";
import { useMutation } from "@tanstack/react-query";

type WithId = { id: string };

export const useModifyData = <TRequest extends WithId, TResponse>(baseUrl: string) => {
  return useMutation<TResponse, Error, TRequest>({
    mutationFn: (data) => editData<TRequest, TResponse>(`${baseUrl}/${data.id}`, data),
  });
};
