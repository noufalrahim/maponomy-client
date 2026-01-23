import { Dispatch, SetStateAction, useMemo } from 'react';
import { ChevronDown, ChevronUp, StoreIcon } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { TCustomer } from '@/types';
import { CustomerOrders } from '../BulkOrder';
import Timeslot from './Timeslot';
import OrderLines from './OrderLines';
import { ProductSelector } from '@/pages/customer/createOrder/_components';
import { useReadData } from '@/hooks/useReadData';
import { TProduct, TServiceResponse } from '@/types';

const END_POINT = '/products';
interface Props {
  customer: TCustomer;
  customerOrders: CustomerOrders[];
  setCustomerOrders: Dispatch<SetStateAction<CustomerOrders[]>>;
}

export default function CustomerOrderCard({
  customer,
  customerOrders,
  setCustomerOrders,
}: Props) {

  const currentOrder = useMemo(
    () => customerOrders.find(o => o.customer.id === customer.id),
    [customerOrders, customer.id]
  );

  const { data, isFetching } =
    useReadData<TServiceResponse<TProduct[]>>(
      'products_list_fetch',
      `${END_POINT}`
    );

  if (!currentOrder) return null;


  return (
    <Card>
      <button
        className="w-full"
        onClick={() =>
          setCustomerOrders(v =>
            v.map(o =>
              o.customer.id === customer.id
                ? { ...o, expanded: !o.expanded }
                : o
            )
          )
        }
      >
        <CardHeader className="flex flex-row gap-2 items-center">
          <div className="bg-accent p-2 rounded-md w-10 h-10 flex items-center justify-center">
            <StoreIcon className='text-primary'/>
          </div>
          <div className="flex flex-col gap-1 flex-1 text-left">
            <CardTitle>{customer.name}</CardTitle>
            <CardDescription>{customer.address}</CardDescription>
          </div>
          {currentOrder.expanded ? <ChevronUp /> : <ChevronDown />}
        </CardHeader>
      </button>

      {currentOrder.expanded && (
        <CardContent className="space-y-4">
          <Timeslot
            customerId={customer.id!}
            setCustomerOrders={setCustomerOrders}
            customerOrder={currentOrder}
          />
          <ProductSelector
            products={data?.data || []}
            orderLines={currentOrder.orderLines}
            isLoading={isFetching}
            onAdd={product =>
              setCustomerOrders(v =>
                v.map(o => {
                  if (o.customer.id !== customer.id) return o;

                  const exists = o.orderLines.some(
                    l => l.productId === product.id
                  );

                  if (exists) return o;

                  return {
                    ...o,
                    orderLines: [
                      ...o.orderLines,
                      {
                        productId: product.id,
                        productName: product.name,
                        quantity: 1,
                        unitPrice: parseFloat(product.price!),
                        lineTotal: parseFloat(product.price!),
                      },
                    ],
                  };
                })
              )
            }
          />
          <OrderLines
            customerOrder={currentOrder}
            setCustomerOrders={setCustomerOrders}
          />
        </CardContent>
      )}
    </Card>
  );
}
