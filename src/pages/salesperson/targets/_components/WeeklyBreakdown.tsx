import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IWeeklyBreakdownProps {
  weeklyBreakdown: {
    week: number;
    target: number;
    achieved: number;
  }[];
}

export default function WeeklyBreakdown({
  weeklyBreakdown
}: IWeeklyBreakdownProps) {


  return (
    <Card className='shadow-xs'>
      <CardHeader className='flex items-start'>
        <CardTitle>Weekly Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weeklyBreakdown.map(w => {
          const pct = Math.min(
            Math.round((w.achieved / w.target) * 100),
            100
          );
          return (
            <div key={w.week} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Week {w.week}</span>
                <span className="text-muted-foreground">
                  ₹{(w.achieved / 1000).toFixed(0)}K /
                  ₹{(w.target / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
