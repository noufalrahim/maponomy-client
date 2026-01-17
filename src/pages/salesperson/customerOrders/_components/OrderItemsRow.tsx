import { TOrder } from '@/types';

export function OrderItemsRow({ order }: { order: TOrder }) {
  return (
    <div className="w-full p-4 space-y-2">
      {order.orderItems?.map((line, i) => (
        <div
          key={i}
          className="flex justify-between bg-background p-2 rounded items-center"
        >
          <div className=' text-start flex flex-col'>
            <p className="font-medium">{line.productName}</p>
            <p className="text-sm text-muted-foreground">
              {line.quantity} × ₹{line.productPrice}
            </p>
          </div>
          <p className="font-semibold">
            ₹{(line.quantity || 0) * (line?.productPrice || 0)}
          </p>
        </div>
      ))}
    </div>
  );
}
