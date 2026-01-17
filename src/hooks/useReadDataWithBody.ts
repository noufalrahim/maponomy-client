// hooks/useReadDataWithBody.ts
import { useQuery } from "@tanstack/react-query";
import { readDataWithBody } from "@/api/services/readDataWithBody";

export function useReadDataWithBody<TResponse, TBody>(
  key: string,
  url: string,
  body: TBody,
  enabled: boolean = true
) {
  return useQuery<TResponse>({
    queryKey: [key, body],
    queryFn: () => readDataWithBody<TResponse, TBody>(url, body),
    enabled
  });
}
