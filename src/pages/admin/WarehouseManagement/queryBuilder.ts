import { QuerySpec, QueryNode } from "@/lib/query";
import { offsetCalculator } from "@/lib/utils";

export const queryBuilder = (
  pagination?: {
    pageSize?: number;
    pageIndex?: number;
  },
  search?: string,
  warehouseId?: string
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

  const conditions: QueryNode[] = [];

  if (search?.trim()) {
    conditions.push({
      or: [
        {
          field: "name",
          op: "like",
          value: search.trim(),
        },
      ],
    });
  }

  if (warehouseId) {
    conditions.push({
      field: "id",
      op: "eq",
      value: warehouseId,
    });
  }

  if (conditions.length > 0) {
    spec.where = conditions.length === 1 ? conditions[0] : { and: conditions };
  }

  return spec;
};
