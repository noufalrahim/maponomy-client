export type TProgress = {
    userId: string;
    totalMonthlyTarget: number;
    totalAchieved: number;
    topPerformer: {
        userId: string;
        salesperson: {
            id: string;
            name: string;
            monthlyTarget: number;
        },
        totalOrdersThisMonth: string,
        totalDeliveredOrdersThisMonth: string,
        totalPendingOrdersThisMonth: string,
        totalCancelledOrdersThisMonth: string,
        totalAmountAchievedThisMonth: string,
    },
    salespersons: {
        salesperson: {
            id: string;
            name: string;
            monthlyTarget: string;
        };
        totalOrdersThisMonth: string;
        totalDeliveredOrdersThisMonth: string;
        totalPendingOrdersThisMonth: string;
        totalCancelledOrdersThisMonth: string;
        totalAmountAchievedThisMonth: string;
    }[]
};

export type TDashboardStats = {
    activeVendors: number;
    products: number;
    totalOrdersPlaced: number;
    totalRevenue: number;
};

export type TProfileStats = {
    salespersonId: string;
    name: string;
    monthlyTarget: number;
    totalVendors: string;
    totalOrders: string;
    totalAchievedThisMonth: string;
    achievementPercentage: number;
    weeklyBreakdown: {
        week: number,
        target: number,
        achieved: number
    }[]

}