"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TProgress } from "@/types";

interface ITargetsListProps {
  data?: TProgress;
}

export default function TargetsList({ data }: ITargetsListProps) {
  const getPercentage = (achieved: number, target: number) => {
    if (!target || target <= 0) return 0;
    return Number(((achieved / target) * 100).toFixed(2));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-start text-lg">
        <CardTitle>Individual Targets</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {data?.salespersons?.map((rep) => {
          const achieved = Number(rep?.totalAmountAchievedThisMonth);
          const target = Number(rep?.salesperson?.monthlyTarget);

          const percentage = getPercentage(achieved, target);
          const colorClass = getProgressColor(percentage);

          return (
            <div key={rep?.salesperson?.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-start">
                  <p className="font-medium">{rep?.salesperson?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {rep?.totalOrdersThisMonth} orders
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{(achieved / 1000).toFixed(0)}K / ₹
                    {(target / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {percentage.toFixed(2)}% achieved
                  </p>
                </div>
              </div>

              <Progress
                value={Math.min(percentage, 100)}
                className="h-3"
                indicatorClassName={colorClass}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
