import { TOrder } from "@/types";
import OrderCard from "./OrderCard";

interface IOrderListProps {
    orders: TOrder[];
}

export default function OrdersList({ orders }: IOrderListProps) {
  return (
    <div className="space-y-3">
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
