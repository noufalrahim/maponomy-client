import { TUser } from "./TUser";

export type TSalesPerson = {
    id?: string;
    userId?: TUser | string;
    user?: TUser;
    vendorId?: string;
    name?: string;
    phoneNumber?: string;
    monthlyTarget?: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    monthlyProgress?: {
        totalOrdersThisMonth: string,
        totalDeliveredOrdersThisMonth: string,
        totalPendingOrdersThisMonth: string,
        totalCancelledOrdersThisMonth: string,
        totalAmountAchievedThisMonth: string
    }
}