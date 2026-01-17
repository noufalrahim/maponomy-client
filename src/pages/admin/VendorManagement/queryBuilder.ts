import { QuerySpec } from "@/lib/query";
import { offsetCalculator } from "@/lib/utils";

export const queryBuilder = (
  pagination?: {
    pageSize?: number;
    pageIndex?: number;
  },
  search?: string
): QuerySpec => {
  const spec: QuerySpec = {
    sort: [
      {
        field: "createdAt",
        direction: "desc",
      },
    ],
    limit: pagination?.pageSize,
    offset: offsetCalculator(pagination),
  };

  if (search?.trim()) {
    spec.where = {
      or: [
        {
          field: "name",
          op: "like",
          value: search.trim(),
        },
        {
          field: "phoneNumber",
          op: "like",
          value: search.trim(),
        }
      ],
    };
  }

  return spec;
};
