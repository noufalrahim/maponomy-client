import { ProductPerformanceGrid, RecentOrdersCard, StatsGrid, TopSalesRepsCard } from './_components';

export default function AdminDashboard() {

  return (
    <div className="space-y-6 animate-fade-in">
      <StatsGrid />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrdersCard />
        <TopSalesRepsCard />
      </div>
      <ProductPerformanceGrid />
    </div>
  );
}
