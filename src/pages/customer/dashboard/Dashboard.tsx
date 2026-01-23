import { useReadData } from "@/hooks/useReadData";
import {
  DashboardHeader,
  FrequentProducts,
  StatsGrid,
  StatsGridSkeleton,
  FrequentProductsSkeleton,
} from "./_components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TProduct, TServiceResponse } from "@/types";

const END_POINT = "/statistics";

export default function CustomerDashboard() {
  const user = useSelector((state: RootState) => state.user.entity);

  const { data, isFetching } = useReadData<
    TServiceResponse<{
      totalOrders: number;
      totalApprovedOrders: number;
      totalPendingOrders: number;
      totalAmount: number;
      frequentlyOrderedProducts: TProduct[];
    }>
  >(
    "customer_dashboard_stats",
    user?.customer?.id
      ? `${END_POINT}/customers/${user.customer.id}`
      : null
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader />

      {isFetching ? (
        <>
          <StatsGridSkeleton />
          <FrequentProductsSkeleton />
        </>
      ) : (
        <>
          <StatsGrid
            stats={{
              totalOrders: data?.data?.totalOrders ?? 0,
              approvedOrders: data?.data?.totalApprovedOrders ?? 0,
              rejectedOrders: 0,
              pendingOrders: data?.data?.totalPendingOrders ?? 0,
              totalSpent: data?.data?.totalAmount ?? 0,
              frequentProducts:
                data?.data?.frequentlyOrderedProducts ?? [],
            }}
          />

          <FrequentProducts
            products={
              (data?.data?.frequentlyOrderedProducts ?? []).map(p => ({
                name: p.name!,
                count: p.quantitySold ?? 0,
                image: p.image ? `${import.meta.env.VITE_STORAGE_API}/images/${p?.image}` : "",
              }))
            }
          />
        </>
      )}
    </div>
  );
}
