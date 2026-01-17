import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersHeader({ total }: { total: number }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className='items-start flex flex-col'>
        <h1 className="text-2xl font-bold">Order History</h1>
        <p className="text-muted-foreground">{total} total order(s)</p>
      </div>
      <Link to="/salesperson/orders/new">
        <Button>
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </Link>
    </div>
  );
}
