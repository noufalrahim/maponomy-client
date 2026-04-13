import { ProductPerformanceGrid, RecentOrdersCard, StatsGrid, TopSalesRepsCard } from './_components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ERole } from '@/types';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const user = useSelector((state: RootState) => state.user.user);
  const userRole = user?.role || localStorage.getItem('userRole');
  const isWarehouseManager = userRole === ERole.WAREHOUSE_MANAGER;

  return (
    <div className="space-y-6 animate-fade-in">
      <StatsGrid />
      <div className={cn("grid gap-6", isWarehouseManager ? "lg:grid-cols-1" : "lg:grid-cols-2")}>
        <RecentOrdersCard />
        {!isWarehouseManager && <TopSalesRepsCard />}
      </div>
      <ProductPerformanceGrid />
    </div>
  );
}
