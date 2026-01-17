import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { withNA } from '@/lib/utils';
import { Target, TrendingUp, Award } from 'lucide-react';

interface ITargetSummary {
  totalTarget: number;
  totalAchieved: number;
  overallPercentage: number;
  topPerformer?: {
    userId: string;
    salesperson: {
      id: string;
      name: string;
      monthlyTarget: number;
    };
    totalOrdersThisMonth: string;
    totalDeliveredOrdersThisMonth: string;
    totalPendingOrdersThisMonth: string;
    totalCancelledOrdersThisMonth: string;
    totalAmountAchievedThisMonth: string;
  };
}

export default function TargetsSummary({
  totalTarget,
  totalAchieved,
  overallPercentage,
  topPerformer,
}: ITargetSummary) {
  const topPerformerPercentage =
    topPerformer?.salesperson?.monthlyTarget &&
    topPerformer.salesperson.monthlyTarget > 0
      ? Number(
          (
            (Number(topPerformer.totalAmountAchievedThisMonth) /
              topPerformer.salesperson.monthlyTarget) *
            100
          ).toFixed(2)
        )
      : null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row justify-between pb-2">
          <CardTitle className="text-md text-muted-foreground">
            Team Target
          </CardTitle>
          <Target className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ₹{(totalTarget / 1000).toFixed(0)}K
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Achieved
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ₹{(totalAchieved / 1000).toFixed(0)}K
          </div>
          <p className="text-xs text-muted-foreground">
            {overallPercentage.toFixed(2)}% of target
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            Top Performer
          </CardTitle>
          <Award className="h-5 w-5 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {withNA(topPerformer?.salesperson?.name)}
          </div>
          <p className="text-xs text-muted-foreground">
            {topPerformerPercentage !== null
              ? `${topPerformerPercentage}% achieved`
              : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
