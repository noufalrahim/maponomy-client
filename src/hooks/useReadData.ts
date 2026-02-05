import { readData } from "@/api/services/readData";
import { useQuery } from "@tanstack/react-query";

type UseReadDataOptions = {
  baseUrl?: string;
  headers?: Record<string, string>;
};

export const useReadData = <T>(
  key: string,
  url: string | null,
  fetchFn?: () => Promise<T>,
  enabled: boolean = true,
  options?: UseReadDataOptions
) => {
  return useQuery<T>({
    queryKey: [key, url, options?.baseUrl],
    queryFn: fetchFn
      ? fetchFn
      : () => {
          if (!url) {
            return Promise.reject(new Error("URL is required"));
          }
          return readData<T>(url, options);
        },
    enabled: enabled && !!url,
  });
};
