// import { EOrderStatus } from "@/types";
import { PaginationParams } from "@/types/ApiType";

export default function PathToApiMapper(
    path: string,
    // status?: EOrderStatus | "active" | "inactive",
    date?: Date,
    searchTerm?: string,
    paginationParams?: PaginationParams,
    searchFields?: string[],
): string | null {
    const params = new URLSearchParams();

    // Add pagination parameters (default limit: 50)
    if (paginationParams?.page) {
        params.append("page", paginationParams.page.toString());
    }
    params.append("limit", (paginationParams?.limit || 50).toString());
    if (paginationParams?.offset) {
        params.append("offset", paginationParams.offset.toString());
    }

    if (date) {
        const parsed = new Date(date);

        if (isNaN(parsed.getTime())) {
            console.error("Invalid date:", date);
            return null;
        }

        const startOfDay = new Date(parsed);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(parsed);
        endOfDay.setHours(23, 59, 59, 999);
    }

    if (searchFields && searchFields.length > 0) {
        searchFields.forEach((field) => {
            params.append(`group3[${field}][like]`, searchTerm || "");
        });
    }

    switch (path) {
        // case EUrl.:
        //   // Use authorized endpoint - backend will automatically filter by user's department
        //   params.append("_order_by", "updatedAt");
        //   params.append("_order_dir", "desc");
        //   return `/patients/department-cases?${params.toString()}`;

        // case EUrl.unitCases:
        //   // Use authorized endpoint - backend will automatically filter by user's unit
        default:
            params.append("_order_by", "updatedAt");
            params.append("_order_dir", "desc");
            return `${path}?${params.toString()}`;

    }
}