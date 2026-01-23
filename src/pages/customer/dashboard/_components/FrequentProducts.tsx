import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { withNA } from '@/lib/utils';

export default function FrequentProducts({
  products
}: {
  products: { name: string; count: number; image: string }[]
}) {
  console.log("Products: ", products);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-start">
          Frequently Ordered Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No orders yet this month
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg"
              >
                <div className='flex flex-row items-center justify-center gap-2'>
                  <span className="flex items-center justify-center w-14 h-14 rounded-md bg-accent text-accent-foreground">
                    {
                      product?.image && product?.image != "" ? (
                        <img src={`${product.image}`} alt="" className="w-full h-full object-cover border border-gray-300 rounded-md" />
                      ) : (
                        <p className="font-bold">{withNA(product?.name?.charAt(0))}</p>
                      )
                    }
                  </span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <span className="text-muted-foreground">
                  {product.count} units
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
