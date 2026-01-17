import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useReadData } from '@/hooks/useReadData';
import { TDashboardStats, TServiceResponse } from '@/types';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  // TrendingUp,
} from 'lucide-react';

const END_POINT = '/statistics/dashboard';

export default function StatsGrid() {
  const {
    data: dashboardStats,
    isFetching: dashboardLoading,
  } = useReadData<TServiceResponse<TDashboardStats>>(
    'progress_list_fetch',
    END_POINT
  );

  const cards = [
    {
      label: 'Total Orders',
      value: dashboardStats?.data?.totalOrdersPlaced,
      icon: ShoppingCart,
    },
    {
      label: 'Total Revenue',
      value: `₹${((dashboardStats?.data?.totalRevenue || 0) / 1000).toFixed(
        0
      )}K`,
      icon: DollarSign,
    },
    {
      label: 'Active Customers',
      value: dashboardStats?.data?.activeVendors,
      icon: Users,
    },
    {
      label: 'Products',
      value: dashboardStats?.data?.products,
      icon: Package,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dashboardLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
              </CardContent>
            </Card>
          ))
        : cards.map(c => (
            <Card key={c.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {c.label}
                </CardTitle>
                <c.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{c.value}</span>
                  {/* <TrendingUp className="h-4 w-4 text-success" /> */}
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
