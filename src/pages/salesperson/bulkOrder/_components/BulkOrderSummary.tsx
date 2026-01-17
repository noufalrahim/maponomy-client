import { Package, ShoppingCart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerOrders } from '../BulkOrder';

interface IBulkOrderSummary {
  customerOrder: CustomerOrders[];
  onSubmit: (data: CustomerOrders[]) => void;
  submitting: boolean;
  grandTotal: number;
}

export default function BulkOrderSummary({
  customerOrder,
  onSubmit,
  submitting,
  grandTotal
}: IBulkOrderSummary) {

  const totalOrders = customerOrder.filter((ord) => ord.orderLines.length > 0);

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="h-5 w-5" />
            Bulk Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customerOrder.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Add products to stores to create orders
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {customerOrder.map((vo) => {
                const storeTotal = vo.orderLines.reduce((sum, l) => sum + (l.quantity! * l.unitPrice!), 0);
                return (
                  <div key={vo.customer.id} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-accent/50">
                    <div className="min-w-0 flex-1 text-start">
                      <p className="text-sm font-medium truncate">{vo.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{vo.orderLines.length} items</p>
                    </div>
                    <p className="font-semibold text-sm">₹{storeTotal.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Total Stores</span>
              <span className="font-medium">{customerOrder.length}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Total Items</span>
              <span className="font-medium">
                {customerOrder.reduce((sum, vo) => sum + vo.orderLines.length, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Grand Total</span>
              <span className="text-primary">₹{grandTotal}</span>
            </div>
          </div>

          <Button
            className="w-full h-12"
            size="lg"
            onClick={() => onSubmit(customerOrder)}
            disabled={totalOrders.length === 0 || submitting}
          >
            {submitting ? 'Creating Orders...' : `Place ${totalOrders.length} Order${totalOrders.length !== 1 ? 's' : ''}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
