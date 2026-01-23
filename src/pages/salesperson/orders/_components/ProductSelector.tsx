import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { withNA } from '@/lib/utils';
import { TOrderItem, TProduct } from '@/types';
import { Check, Plus } from 'lucide-react';

interface Props {
  products: TProduct[];
  orderLines: TOrderItem[];
  onAdd: (product: TProduct) => void;
  isLoading: boolean;
}

export default function ProductSelector({
  products,
  orderLines,
  onAdd,
  isLoading,
}: Props) {
  return (
    <Card>
      <CardHeader className='flex items-start'>
        <CardTitle className="text-lg">Add Products</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No products available
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map(product => {
              const inCart = orderLines.find(
                l => l.productId === product.id
              );

              return (
                <button
                  key={product.id}
                  onClick={() => onAdd(product)}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-accent/50 transition"
                >
                  <div className='flex flex-row gap-2 items-center justify-center'>
                    <span className="flex items-center justify-center w-14 h-14 rounded-md bg-accent text-accent-foreground">
                    {
                        product?.image && product?.image != "" ? (
                            <img src={`${import.meta.env.VITE_STORAGE_API}/images/${product?.image}`} alt="" className="w-full h-full object-cover border border-gray-300 rounded-md" />
                        ) : (
                            <p className="font-bold">{withNA(product?.name?.charAt(0))}</p>
                        )
                    }
                </span>
                    <div className="text-left">
                      <p className="font-medium">{withNA(product?.name)}</p>
                      <p className="text-sm text-muted-foreground">
                        {withNA(product?.measureUnit)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        ₹{withNA(product?.price)}
                      </p>
                    </div>
                  </div>
                  {inCart ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground">
                      <Plus className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
