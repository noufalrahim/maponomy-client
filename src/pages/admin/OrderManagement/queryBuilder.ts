import { QuerySpec } from "@/lib/query";
import { offsetCalculator } from "@/lib/utils";

export const queryBuilder = (
    pagination?: {
        pageSize?: number;
        pageIndex?: number;
    }
): QuerySpec => {
    return (
        {
            sort: [
                {
                    field: "createdAt",
                    direction: "desc"
                }
            ],
            limit: pagination?.pageSize,
            offset: offsetCalculator(pagination)
        }
    )
};