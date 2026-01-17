/* eslint-disable react-hooks/incompatible-library */
import { useMemo, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, Loader2 } from "lucide-react"
import { TOrder, TProduct, TServiceResponse } from "@/types"
import { useReadData } from "@/hooks/useReadData"

const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1)
})

const OrderSchema = z.object({
  orderId: z.string(),
  items: z.array(OrderItemSchema)
})

export type OrderFormValues = z.infer<typeof OrderSchema>

interface IOrderFormProps {
  actionItem: TOrder | null;
  onSubmit: (data: OrderFormValues) => void;
  loading: boolean;
  setOpen: (open: boolean) => void;
}

const END_POINT = '/products';

export default function OrderForm({ actionItem, onSubmit, loading, setOpen }: IOrderFormProps) {

  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const { data: res, isFetching } = useReadData<TServiceResponse<TProduct[]>>('products_for_customer_list_fetch', `${END_POINT}/customer/${actionItem?.customer?.id}`);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      orderId: actionItem?.id,
      items: actionItem?.orderItems?.map(item => ({
        productId: item.productId,
        name: item.productName,
        price: item.productPrice,
        quantity: item.quantity
      })) || []
    }
  })

  const items = form.watch("items")

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const addItem = () => {
    if (!selectedProduct) return
    const product = res?.data?.find(p => p.id === selectedProduct)
    if (!product) return
    const exists = items.find(i => i.productId === product.id)
    if (exists) return
    form.setValue("items", [
      ...items,
      {
        productId: product.id!,
        name: product.name!,
        price: Number(product.price),
        quantity: 1
      }
    ])
    setSelectedProduct("")
  }

  const updateQty = (index: number, delta: number) => {
    const item = items[index]
    const next = item.quantity + delta
    if (next < 1) return
    const updated = [...items]
    updated[index] = { ...item, quantity: next }
    form.setValue("items", updated)
  }

  const removeItem = (index: number) => {
    const updated = [...items]
    updated.splice(index, 1)
    form.setValue("items", updated)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order ID</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select product to add" />
            </SelectTrigger>
            <SelectContent>
              {res?.data?.map(p => (
                <SelectItem key={p.id} value={p.id!}>
                  {p.name}
                </SelectItem>
              ))}
              {
                isFetching && (
                  <div className="flex items-center w-full justify-center py-2">
                    <Loader2 className="animate-spin text-primary"/>
                  </div>
                )
              }
            </SelectContent>
          </Select>
          <Button type="button" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
        {items.map((item, index) => (
          <div
            key={item.productId}
            className="grid grid-cols-[1fr_260px_160px] items-center gap-4 rounded-md border p-2"
          >
            {/* LEFT: Product name */}
            <div className="font-medium truncate">
              {item.name}
            </div>

            {/* MIDDLE: Quantity controls + single item price */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateQty(index, -1)}
                >
                  <Minus />
                </Button>

                <span className="w-8 text-center">{item.quantity}</span>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateQty(index, 1)}
                >
                  <Plus />
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <span>₹</span>
                <Input className="w-24" value={item.price} disabled />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <span className="w-20 text-right font-medium">
                ₹{item.price * item.quantity}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}


        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Order Total</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={loading} onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {
              loading ? (
                <Loader2 className="animate-spin text-primary" />
              ) : (
                "Save Changes"
              )
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}
