import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useReadDataWithBody } from '@/hooks/useReadDataWithBody';
import { QuerySpec } from '@/lib/query';
import { TProduct, TServiceResponse } from '@/types';
import { queryBuilder } from '../../ProductCatalog/queryBuilder';
import { withNA } from '@/lib/utils';

const END_POINT = '/products';

export default function ProductPerformanceGrid() {
  const { data: res, isFetching } =
    useReadDataWithBody<TServiceResponse<TProduct[]>, QuerySpec>(
      "product_list",
      `${END_POINT}/query`,
      queryBuilder({
        pageSize: 5,
        pageIndex: 0
      })
    );
  return (
    <Card>
      <CardHeader className="items-start flex">
        <CardTitle>Product Performance</CardTitle>
      </CardHeader>

      <CardContent>
        {isFetching && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {!isFetching && res?.data?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No products
          </p>
        )}

        {!isFetching && res && res.data && res?.data?.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {res.data.map(p => (
              <div key={p.id} className="rounded-lg border p-4">
                <div className="flex flex-row gap-2 items-center justify-start pb-3">
                   <span className="flex items-center justify-center w-14 h-14 rounded-md bg-accent text-accent-foreground">
                    {
                      p?.image && p?.image != "" ? (
                        <img src={`${import.meta.env.VITE_STORAGE_API}/images/${p?.image}`} alt="" className="w-full h-full object-cover border border-gray-300 rounded-md" />
                      ) : (
                        <p className="font-bold">{withNA(p?.name?.charAt(0))}</p>
                      )
                    }
                  </span>
                  <div className="flex flex-col items-start">
                    <p className="font-semibold">{withNA(p?.name)}</p>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Qty Sold</span>
                    <span>{p.quantitySold}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="text-primary">₹{parseFloat(p?.price || "0") * (p?.quantitySold || 0)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
