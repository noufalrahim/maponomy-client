import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { EOrderStatus, TOrder } from '@/types';
import { badgeFields, cn, withNA } from '@/lib/utils';

interface IOrderCardProps {
    order: TOrder;
}

export default function OrderCard({ order }: IOrderCardProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-5">
                <div className="flex justify-between">
                    <div className='flex flex-col gap-2 items-start gap-5'>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-muted-foreground">
                                {withNA(order?.id)}
                            </span>
                            <Badge variant={'outline'} className={cn('cursor-pointer', badgeFields(withNA(order?.status) as EOrderStatus).bgColor, badgeFields(withNA(order?.status) as EOrderStatus).textColor)}>{badgeFields(withNA(order?.status) as EOrderStatus).text}</Badge>
                        </div>
                        <h3 className="font-semibold">{order?.customer?.name}</h3>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(withNA(order?.deliveryDate)).toDateString()} ({order?.deliveryStartTime} - {order?.deliveryEndTime})
                        </p>
                    </div>

                    <div className="text-right items-end justify-start flex-col flex gap-2">
                        <p className="text-xl font-bold">₹{withNA(order?.totalAmount)}</p>
                        {/* <div className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer">
                            Details <ChevronRight className="h-4 w-4" />
                        </div> */}
                    </div>
                </div>

                <div className='h-[1px] bg-gray-200 my-5' />

                {order.orderItems && order?.orderItems?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {order.orderItems.map((l, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 rounded-md bg-muted text-xs"
                            >
                                {l.productName} × {l.quantity}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
