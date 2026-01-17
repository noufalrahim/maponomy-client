import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, LucideIcon, TrendingUp } from 'lucide-react';

export default function StatsGrid({
  orderCount,
  totalRevenue,
}: {
  orderCount: number;
  totalRevenue: number;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Stat
        title="Total Orders"
        value={orderCount.toString()}
        subtitle="This month"
        icon={Award}
      />
      <Stat
        title="Avg Order Value"
        value={
          orderCount > 0
            ? `₹${Math.round(totalRevenue / orderCount)}`
            : '0'
        }
        subtitle="Per order"
        icon={TrendingUp}
      />
    </div>
  );
}

interface IStatProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

function Stat({ title, value, subtitle, icon: Icon }: IStatProps) {
  return (
    <Card className='shadow-xs'>
      <CardHeader className="flex justify-between flex-row pb-2">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
