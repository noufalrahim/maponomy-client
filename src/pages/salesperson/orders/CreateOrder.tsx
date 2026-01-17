/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateOrderDTO, EOrderStatus, EUrl, TOrder, TProduct } from '@/types';
import { TOrderItem } from '@/types';
import { useReadData } from '@/hooks/useReadData';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TServiceResponse } from '@/types';
import { TCustomer } from '@/types';
import { OrderSummary, ProductSelector, VendorSection, CreateOrderHeader } from './_components';
import { useCreateData } from '@/hooks/useCreateData';

const CUSTOMER_END_POINT = '/vendors'
const PRODUCT_END_POINT = '/products'
const ORDER_END_POINT = '/orders'

export default function CreateOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedVendorId = searchParams.get('vendor');

  const [selectedVendorId, setSelectedVendorId] = useState(preselectedVendorId || '');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryWindow, setDeliveryWindow] = useState<{
    deliveryStartTime: string | null;
    deliveryEndTime: string | null;
  }>({
    deliveryStartTime: null,
    deliveryEndTime: null,
  });
  const [orderLines, setOrderLines] = useState<TOrderItem[]>([]);


  const orderTotal = orderLines.reduce((s, l) => s + (l.quantity || 0) * (l.unitPrice || 0), 0);

  const user = useSelector((state: RootState) => state?.user?.entity);

  const { data: vendors, isLoading: vendorsIsLoading } = useReadData<TServiceResponse<TCustomer[]>>('vendors_by_salesperson_list_fetch', `${CUSTOMER_END_POINT}/salesperson/${user?.salesperson?.id}`)
  const { data: products, isLoading: productsIsLoading } = useReadData<TServiceResponse<TProduct[]>>('products_by_vendors_list_fetch', `${PRODUCT_END_POINT}/customer/${selectedVendorId}`)

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
    if (!selectedVendorId || !orderLines.length || !user || !user.id) {
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
      vendorId: selectedVendorId,
      deliveryDate,
      status: EOrderStatus.CONFIRMED,
      createdBy: user!.id!,
      deliveryStartTime: deliveryWindow.deliveryStartTime,
      deliveryEndTime: deliveryWindow.deliveryEndTime,
      orderItems: orderLines.map(l => ({
        productId: l.productId as string,
        quantity: l.quantity as number,
        unitPrice: l.unitPrice as number,
      })),
    };
    if (deliveryWindow.deliveryEndTime)
      console.log("Data: ", payload);
    mutate(payload,
      {
        onSuccess: (res) => {
          if (res && res.success) {
            toast.success('Order created successfully');
            navigate(EUrl.SALES_ORDERS);
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

  // if (loading) return <LoadingState />;

  return (
    <div className="space-y-6 animate-fade-in">
      <CreateOrderHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <VendorSection
            vendors={vendors?.data || []}
            selectedVendorId={selectedVendorId}
            onVendorChange={setSelectedVendorId}
            isLoading={vendorsIsLoading}
            deliveryDate={deliveryDate}
            setDeliveryDate={setDeliveryDate}
            deliveryWindow={deliveryWindow}
            setDeliveryWindow={setDeliveryWindow}
          />

          {selectedVendorId && (
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
