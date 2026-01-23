/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateOrderDTO, EOrderStatus, EUrl, TOrder, TProduct } from '@/types';
import { TOrderItem } from '@/types';
import { useReadData } from '@/hooks/useReadData';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TServiceResponse } from '@/types';
import { OrderSummary, ProductSelector, VendorSection, CreateOrderHeader } from '.';
import { useCreateData } from '@/hooks/useCreateData';

const PRODUCT_END_POINT = '/products'
const ORDER_END_POINT = '/orders'

export default function CreateOrder() {
  // const navigate = useNavigate();

  const navigate = useNavigate();

  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderLines, setOrderLines] = useState<TOrderItem[]>([]);
  const [deliveryWindow, setDeliveryWindow] = useState<{
    deliveryStartTime: string | null;
    deliveryEndTime: string | null;
  }>({
    deliveryStartTime: null,
    deliveryEndTime: null,
  });

  const orderTotal = orderLines.reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0), 0);

  const user = useSelector((state: RootState) => state?.user?.entity);

  console.log("User: ", user);

  const { data: products, isLoading: productsIsLoading } = useReadData<TServiceResponse<TProduct[]>>('products_list_fetch', `${PRODUCT_END_POINT}`)

  const { mutate, isPending } = useCreateData<CreateOrderDTO, TServiceResponse<TOrder>>(ORDER_END_POINT);

  const addProduct = (product: TProduct) => {
    const existing = orderLines.find(l => l.productId === product.id);

    if (existing) {
      updateQuantity(product.id!, existing.quantity! + 1);
      return;
    }

    setOrderLines([
      ...orderLines,
      {
        productId: product.id!,
        productName: product.name!,
        quantity: 1,
        unitPrice: parseFloat(product.price!),
      },
    ]);

  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) {
      setOrderLines(orderLines.filter(l => l.productId !== productId));
      return;
    }
    setOrderLines(orderLines.map(l =>
      l.productId === productId
        ? { ...l, quantity: qty, lineTotal: qty * (l.unitPrice || 0) }
        : l
    ));
  };

  const handleSubmit = async () => {
    if (!user || !user.customer || !user.customer.id || !orderLines.length || !user || !user.id) {
      toast.error('Please complete the order');
      return;
    }
    if (!deliveryDate) {
      toast.error('Please select delivery date');
      return;
    }
    if (!deliveryWindow.deliveryEndTime || !deliveryWindow.deliveryStartTime) {
      toast.error('Please select delivery time');
      return;
    }
    const payload: CreateOrderDTO = {
      vendorId: user.customer.id,
      deliveryDate,
      deliveryStartTime: deliveryWindow.deliveryStartTime,
      deliveryEndTime: deliveryWindow.deliveryEndTime,
      status: EOrderStatus.PENDING,
      createdBy: user!.id!,
      orderItems: orderLines.map(l => ({
        productId: l.productId as string,
        quantity: l.quantity as number,
        unitPrice: l.unitPrice as number,
      })),
    };
    mutate(payload,
      {
        onSuccess: (res) => {
          if (res && res.success) {
            toast.success('Order created successfully');
            navigate(EUrl.CUSTOMER_ORDERS);
          }
          else {

            toast.error('Failed to create order');
          }
        },
        onError: (_err) => {
          toast.error('Failed to create order');
        }
      }
    );

  };

  return (
    <div className="space-y-6 animate-fade-in">
      <CreateOrderHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <VendorSection
            deliveryDate={deliveryDate}
            setDeliveryDate={setDeliveryDate}
            deliveryWindow={deliveryWindow}
            setDeliveryWindow={setDeliveryWindow}
          />

          {user?.customer?.id && (
            <ProductSelector
              products={products?.data || []}
              orderLines={orderLines}
              isLoading={productsIsLoading}
              onAdd={addProduct}
            />
          )}
        </div>

        <OrderSummary
          orderLines={orderLines}
          updateQuantity={updateQuantity}
          removeLine={(id) =>
            setOrderLines(orderLines.filter(l => l.productId !== id))
          }
          total={orderTotal}
          submitting={isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
