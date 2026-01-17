/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateOrderDTO, EOrderStatus, EUrl, TCustomer, TOrder, TOrderItem, TServiceResponse } from '@/types';
import { BulkOrderSummary, CustomerOrderCard, GlobalDeliverySettings } from './_components';
import { useReadData } from '@/hooks/useReadData';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import { useCreateData } from '@/hooks/useCreateData';

const CUSTOMER_END_POINT = '/vendors';
const ORDER_END_POINT = '/orders';

export interface CustomerOrders {
  customer: TCustomer;
  orderLines: TOrderItem[];
  expanded: boolean;
  deliveryDate?: string;
  deliveryWindow?: {
    deliveryStartTime: string;
    deliveryEndTime: string;
  };
}

export default function BulkOrder() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.entity);

  const [customerOrders, setCustomerOrders] = useState<CustomerOrders[]>([]);
  const [loading] = useState(false);

  const { data: customerRes } =
    useReadData<TServiceResponse<TCustomer[]>>(
      'customer_under_salesperson_list_fetch',
      `${CUSTOMER_END_POINT}/salesperson/${user?.salesperson?.id}`
    );

  const { mutate, isPending } = useCreateData<CreateOrderDTO[], TServiceResponse<TOrder[]>>(`${ORDER_END_POINT}/bulk-orders`);

  useEffect(() => {
    if (!customerRes?.data) return;

    setCustomerOrders(
      customerRes.data.map(c => ({
        customer: c,
        orderLines: [],
        expanded: false,
        deliveryDate: '',
        deliveryWindow: {
          deliveryStartTime: '',
          deliveryEndTime: '',
        },
      }))
    );
  }, [customerRes]);

  const vendorsWithOrders = useMemo(
    () => customerOrders.filter(v => v.orderLines.length > 0),
    [customerOrders]
  );

  const grandTotal = useMemo(
    () =>
      vendorsWithOrders.reduce(
        (sum, v) =>
          sum + v.orderLines.reduce((s, l) => s + (l.quantity! * l.unitPrice!), 0),
        0
      ),
    [vendorsWithOrders]
  );

  const handleSubmit = (data: CustomerOrders[]) => {
    const orders: CreateOrderDTO[] = [];

    for (const d of data) {
      if (!d.orderLines || d.orderLines.length === 0) continue;

      if (!d.deliveryDate || !d.deliveryWindow) {
        toast.error(
          `Please add delivery date and delivery window for ${d.customer.name}`
        );
        return;
      }

      orders.push({
        vendorId: d.customer.id!,
        deliveryDate: d.deliveryDate,
        deliveryEndTime: d.deliveryWindow.deliveryEndTime,
        deliveryStartTime: d.deliveryWindow.deliveryStartTime,
        status: EOrderStatus.CONFIRMED,
        createdBy: user!.id!,
        orderItems: d.orderLines.map(l => ({
          productId: l.productId as string,
          quantity: l.quantity!,
          unitPrice: l.unitPrice!,
        })),
      });
    }

    if (orders.length === 0) {
      toast.error('No valid orders to submit');
      return;
    }

    mutate(orders, {
      onSuccess: (res) => {
        if (res?.success && res.data) {
          toast.success('Orders created successfully');
          navigate(EUrl.SALES_ORDERS);
        } else {
          toast.error('Failed to create orders');
        }
      },
      onError: () => {
        toast.error('Failed to create orders');
      },
    });
  };

  const toggleAllOpen = () => {
    setCustomerOrders(prev =>
      prev.map(v => ({
        ...v,
        expanded: !v.expanded,
      }))
    );
  };

  if (loading) return <div className="h-40 animate-spin" />;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <div className='text-start flex flex-col'>
            <h1 className="text-2xl font-bold">Bulk Order</h1>
            <p className="text-muted-foreground">Multi-store ordering</p>
          </div>
        </div>
        <Badge className='text-gray-600 bg-gray-100 hover:bg-gray-200 border-gray-200' onClick={toggleAllOpen}>{customerOrders.length} Stores</Badge>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlobalDeliverySettings setCustomerOrders={setCustomerOrders} />
          {customerRes?.data?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                No customers found
              </p>
              <p className="mt-1 text-xs text-muted-foreground italic">
                Try contacting administrator to add customers!
              </p>
            </div>
          )}
          {customerOrders.map(cu => (
            <CustomerOrderCard
              key={cu.customer.id}
              customer={cu.customer}
              customerOrders={customerOrders}
              setCustomerOrders={setCustomerOrders}
            />
          ))}
        </div>
        <BulkOrderSummary customerOrder={customerOrders} onSubmit={handleSubmit} submitting={isPending} grandTotal={grandTotal} />
      </div>
    </div>
  );
}
