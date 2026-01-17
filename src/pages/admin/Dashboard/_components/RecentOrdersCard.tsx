import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight } from 'lucide-react';
import { EOrderStatus, TOrder, TServiceResponse } from '@/types';
import { badgeFields, cn, withNA } from '@/lib/utils';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { QuerySpec } from '@/lib/query';

const END_POINT = '/orders';

export default function RecentOrdersCard() {

  const { data, isFetching } =
    useReadDataWithBody<TServiceResponse<TOrder[]>, QuerySpec>(
      "product_list",
      `${END_POINT}/query`,
      {
        sort: [
          {
            field: "createdAt",
            direction: "desc"
          }
        ],
        limit: 5,
      }
    );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <a href="/admin/orders" className="text-sm text-primary flex items-center gap-1">
          View all <ArrowUpRight className="h-4 w-4" />
        </a>
      </CardHeader>

      <CardContent className="space-y-3">
        {isFetching &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between rounded-lg border p-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}

        {!isFetching && data?.data?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No orders</p>
        )}

        {!isFetching &&
          data?.data?.map(o => (
            <div key={o.id} className="flex justify-between rounded-lg border p-4">
              <div className="flex flex-col items-start">
                <p className="font-medium">{withNA(o.customer?.name)}</p>
                <p className="text-sm text-muted-foreground">
                  {withNA(o.id)} • Sales Rep
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₹{o?.totalAmount?.toLocaleString()}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    'cursor-pointer',
                    badgeFields(withNA(o?.status) as EOrderStatus).bgColor,
                    badgeFields(withNA(o?.status) as EOrderStatus).textColor
                  )}
                >
                  {badgeFields(withNA(o?.status) as EOrderStatus).text}
                </Badge>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
