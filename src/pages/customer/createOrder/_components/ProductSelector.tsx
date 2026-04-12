import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { withNA } from '@/lib/utils';
import { TOrderItem, TProduct } from '@/types';
import { Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.categoryId?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product);
    return acc;
  }, {} as Record<string, TProduct[]>);

  const categories = Object.keys(groupedProducts).sort();

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
          <div className="space-y-4">
            {categories.map(categoryName => {
              const isExpanded = expandedCategories[categoryName] ?? true; // Default to expanded
              const categoryProducts = groupedProducts[categoryName];

              return (
                <div key={categoryName} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(categoryName)}
                    className="w-full flex items-center justify-between p-4 bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    <h3 className="font-semibold text-md">{categoryName} ({categoryProducts.length})</h3>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>

                  <div className={cn(
                    "grid gap-3 p-4 sm:grid-cols-2",
                    !isExpanded && "hidden"
                  )}>
                    {categoryProducts.map(product => {
                      const inCart = orderLines.find(
                        l => l.productId === product.id
                      );

                      return (
                        <button
                          key={product.id}
                          onClick={() => onAdd(product)}
                          className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-accent/50 transition text-left"
                        >
                          <div className='flex flex-row gap-3 items-center'>
                            <span className="flex items-center justify-center w-14 h-14 rounded-md bg-accent text-accent-foreground shrink-0 overflow-hidden">
                              {
                                product?.image && product?.image != "" ? (
                                  <img src={`${import.meta.env.VITE_STORAGE_API}/images/${product?.image}`} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <p className="font-bold">{withNA(product?.name?.charAt(0))}</p>
                                )
                              }
                            </span>
                            <div>
                              <p className="font-medium line-clamp-1">{withNA(product?.name)}</p>
                              <p className="text-xs text-muted-foreground">
                                {withNA(product?.measureUnit)}
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                ₹{withNA(product?.price)}
                              </p>
                            </div>
                          </div>
                          {inCart ? (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                              <Check className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border text-muted-foreground shrink-0">
                              <Plus className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
