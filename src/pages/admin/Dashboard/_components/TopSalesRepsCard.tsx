import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useReadData } from '@/hooks/useReadData';
import { withNA } from '@/lib/utils';
import { TProgress, TServiceResponse } from '@/types';
import { ArrowUpRight } from 'lucide-react';

const END_POINT = '/statistics/progress/salesperson-progress';

export default function TopSalesRepsCard() {
  
  const {
    data: salespersonProgress,
    isFetching: salespersonLoading,
  } = useReadData<TServiceResponse<TProgress>>(
    'progress_list_fetch',
    END_POINT
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Top Sales Reps</CardTitle>
        <a
          href="/admin/salesperson"
          className="text-sm text-primary flex items-center gap-1"
        >
          View all <ArrowUpRight className="h-4 w-4" />
        </a>
      </CardHeader>

      <CardContent className="space-y-4">
        {salespersonLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 justify-between"
            >
              <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}

        {!salespersonLoading &&
          salespersonProgress?.data?.salespersons?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No reps
            </p>
          )}

        {!salespersonLoading &&
          salespersonProgress?.data?.salespersons?.map((r, i) => (
            <div
              key={r?.salesperson?.id}
              className="flex items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div className="flex flex-col items-start">
                  <p className="font-medium">
                    {withNA(r?.salesperson?.name)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {withNA(r?.totalOrdersThisMonth)} orders
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₹{withNA(r?.totalAmountAchievedThisMonth)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Revenue
                </p>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
