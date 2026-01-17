/* eslint-disable react-hooks/rules-of-hooks */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EOrderStatus, TOrder, TServiceResponse } from '@/types';
import { badgeFields, cn, withNA } from '@/lib/utils';
import { useReadData } from '@/hooks/useReadData';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from '@/components/Loader';

interface IRecentOrdersProps {
  id?: string;
}

export default function RecentOrders({ id }: IRecentOrdersProps) {

    if (!id) return <Loader />;

  const { data: orders, isFetching } = useReadData<TServiceResponse<TOrder[]>>( 'salesperson_orders_fetch', `/orders/salesperson/${id}`);

  if (isFetching) {
    return (
      <Card>
        <CardHeader className='items-start flex'>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>

              <div className="space-y-2 text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-6 w-24 ml-auto rounded-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (orders?.data?.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No orders yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="items-start flex">
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {orders?.data?.slice(0, 5).map(order => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
          >
            <div className="items-start flex flex-col">
              <p className="font-medium">
                {withNA(order.customer?.name)}
              </p>
              <p className="text-sm text-muted-foreground">
                {withNA(order.id)} •{' '}
                {new Date(withNA(order.deliveryDate)).toDateString()}
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="font-semibold">
                ₹{Number(order.totalAmount).toLocaleString()}
              </p>
              <Badge
                variant="outline"
                className={cn(
                  'cursor-pointer',
                  badgeFields(withNA(order.status) as EOrderStatus).bgColor,
                  badgeFields(withNA(order.status) as EOrderStatus).textColor
                )}
              >
                {badgeFields(withNA(order.status) as EOrderStatus).text}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
