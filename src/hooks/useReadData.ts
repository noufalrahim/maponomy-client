import { readData } from "@/api/services/readData";
import { useQuery } from "@tanstack/react-query";

export const useReadData = <T>(key: string, url: string | null, fetchFn?: () => Promise<T>, enabled: boolean = true) => {
  return useQuery<T>({
    queryKey: [key, url],
    queryFn: fetchFn ? fetchFn : () => readData<T>(url ? url : ''),
    enabled,
  });
};
