/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuerySpec } from "@/lib/query";
import { offsetCalculator } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export const queryBuilder = (
  pagination?: {
    pageSize?: number;
    pageIndex?: number;
  },
  search?: string,
  filters?: {
    statuses?: string[];
    dateRange?: DateRange;
    pushedToErpOnly?: boolean;
  },
  warehouseId?: string
): QuerySpec => {
  const andConditions: any[] = [];

  if (search?.trim()) {
    andConditions.push({
      or: [
        { field: "customer.name", op: "like", value: search.trim() },
        { field: "salesperson.name", op: "like", value: search.trim() },
        { field: "id", op: "like", value: search.trim() },
      ],
    });
  }

  if (filters?.statuses && filters.statuses.length > 0) {
    andConditions.push({
      field: "status",
      op: "in",
      value: filters.statuses,
    });
  }

  if (filters?.dateRange?.from) {
    andConditions.push({
      field: "createdAt",
      op: "gte",
      value: filters.dateRange.from.toISOString(),
    });
  }

  if (filters?.dateRange?.to) {
    andConditions.push({
      field: "createdAt",
      op: "lte",
      value: filters.dateRange.to.toISOString(),
    });
  }

  if (filters?.pushedToErpOnly) {
    andConditions.push({
      field: "pushedToErp",
      op: "eq",
      value: true,
    });
  }

  if (warehouseId) {
    andConditions.push({
      field: "warehouseId",
      op: "eq",
      value: warehouseId,
    });
  }

  return {
    sort: [{ field: "createdAt", direction: "desc" }],
    limit: pagination?.pageSize,
    offset: offsetCalculator(pagination),
    where: andConditions.length > 0 ? { and: andConditions } : undefined,
  };
};
