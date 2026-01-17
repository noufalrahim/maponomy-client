import { Users, ClipboardList, Target, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';

interface IStatsGridProps {
    assignedVendors: number;
    orders: number;
    targets: {
      monthlyTarget: number;
      achieved: number;
    };
}

export default function StatsGrid({
  assignedVendors,
  orders,
  targets,
}: IStatsGridProps) {

  const monthlyTarget = targets?.monthlyTarget || 0;
  const achieved = targets?.achieved || 0;
  const percentage =
    monthlyTarget > 0 ? Math.round(((achieved) / monthlyTarget) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Assigned Customers"
        value={assignedVendors}
        subtitle="Active accounts"
        icon={Users}
      />

      <StatCard
        title="Today's Orders"
        value={orders}
        subtitle="Orders placed today"
        icon={ClipboardList}
      />

      <StatCard
        title="Monthly Target"
        value={`₹${(monthlyTarget / 1000).toFixed(0)}K`}
        subtitle="This month's goal"
        icon={Target}
      />

      <StatCard
        title="Achievement"
        value={`${percentage}%`}
        icon={TrendingUp}
        progress={percentage}
      />
    </div>
  );
}
