import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { TOrderItem } from '@/types';
import { withNA } from '@/lib/utils';

interface Props {
  orderLines: TOrderItem[];
  updateQuantity: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  total: number;
  submitting: boolean;
  onSubmit: () => void;
}

export default function OrderSummary({
  orderLines,
  updateQuantity,
  removeLine,
  total,
  submitting,
  onSubmit,
}: Props) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {orderLines.length === 0 ? (
          <p className="text-center py-8 text-sm text-muted-foreground">
            No products added yet
          </p>
        ) : (
          <div className="space-y-3">
            {orderLines.map(line => (
              <div
                key={line.productId as string}
                className="space-y-2 pb-3 border-b last:border-0"
              >
                <div className="flex justify-between">
                  <p className="font-medium text-sm">{withNA(line.productName)}</p>
                  <button
                    onClick={() => removeLine(line.productId as string)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(line.productId as string, (line.quantity || 0) - 1)
                      }
                      className="h-8 w-8 rounded-lg border items-center flex justify-center"
                    >
                      <Minus className="h-3 w-3" />
                    </button>

                    <span className="w-8 text-center font-medium">
                      {line.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(line.productId as string, (line.quantity || 0) + 1)
                      }
                      className="h-8 w-8 rounded-lg border items-center flex justify-center"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <p className="font-semibold">
                    ₹{(line?.quantity || 0) * (line?.unitPrice || 0)}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

        <div className="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">
            ₹{total.toLocaleString()}
          </span>
        </div>

        <Button
          className="w-full h-12"
          size="lg"
          disabled={!orderLines.length || submitting}
          onClick={onSubmit}
        >
          {submitting && <Loader2 className="animate-spin"/>}
          {submitting ? 'Creating...' : 'Place Order'}
        </Button>
      </CardContent>
    </Card>
  );
}
