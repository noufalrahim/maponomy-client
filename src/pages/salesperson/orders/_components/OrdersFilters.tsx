import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { EOrderStatus, TOrder } from '@/types';

export default function OrdersFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  orders,
}: {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  orders: TOrder[];
}) {
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === EOrderStatus.PENDING).length,
    confirmed: orders.filter(o => o.status === EOrderStatus.CONFIRMED).length,
    rejected: orders.filter(o => o.status === EOrderStatus.REJECTED).length,
    cancelled: orders.filter(o => o.status === EOrderStatus.CANCELLED).length,
    delivered: orders.filter(o => o.status === EOrderStatus.DELIVERED).length,
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search orders..."
          className="pl-10 h-12"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Button
            key={status}
            size="sm"
            variant={statusFilter === status ? 'default' : 'outline'}
            onClick={() => onStatusChange(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
          </Button>
        ))}
      </div>
    </div>
  );
}
