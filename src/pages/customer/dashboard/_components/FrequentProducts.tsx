import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FrequentProducts({
  products
}: {
  products: { name: string; count: number }[]
}) {
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
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
              >
                <span className="font-medium">{product.name}</span>
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
