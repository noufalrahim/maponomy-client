/* eslint-disable react-hooks/incompatible-library */
import { useMemo, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, Loader2 } from "lucide-react"
import { EOrderStatus, ERole, TOrder, TProduct, TServiceResponse } from "@/types"
import { useReadData } from "@/hooks/useReadData"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1)
})

const OrderSchema = z.object({
  orderId: z.string(),
  deliveryDate: z.string().min(1),
  deliveryStartTime: z.string().min(1),
  deliveryEndTime: z.string().min(1),
  status: z.enum([
    EOrderStatus.PENDING,
    EOrderStatus.CONFIRMED,
    EOrderStatus.DELIVERED,
    EOrderStatus.CANCELLED,
    EOrderStatus.REJECTED
  ]),
  items: z.array(OrderItemSchema)
})

export type OrderFormValues = z.infer<typeof OrderSchema>

interface Props {
  actionItem: TOrder | null
  onSubmit: (data: OrderFormValues) => void
  loading: boolean
  setOpen: (v: boolean) => void
}

const END_POINT = "/products"

export default function OrderForm({
  actionItem,
  onSubmit,
  loading,
  setOpen
}: Props) {

  const [selectedEgg, setSelectedEgg] = useState("")
  const [selectedOther, setSelectedOther] = useState("")
  const user = useSelector((state: RootState) => state.user.entity)
  const isAdmin = user?.role === ERole.ADMIN

  const { data: res, isFetching } =
    useReadData<TServiceResponse<TProduct[]>>(
      "products_list_fetch",
      `${END_POINT}`
    )

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      orderId: actionItem?.id || "",
      deliveryDate: actionItem?.deliveryDate || "",
      deliveryStartTime: actionItem?.deliveryStartTime || "",
      deliveryEndTime: actionItem?.deliveryEndTime || "",
      status: actionItem?.status || EOrderStatus.PENDING,
      items:
        actionItem?.orderItems?.map(i => ({
          productId: i.productId,
          name: i.productName,
          price: i.productPrice,
          quantity: i.quantity
        })) || []
    }
  })

  const items = form.watch("items")

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  )

  const eggRelated = useMemo(() => 
    res?.data?.filter(p => 
      p.name?.toLowerCase().includes("egg") || 
      p.categoryId?.name?.toLowerCase().includes("egg")
    ) || [], [res?.data])

  const otherProducts = useMemo(() => 
    res?.data?.filter(p => 
      !p.name?.toLowerCase().includes("egg") && 
      !p.categoryId?.name?.toLowerCase().includes("egg")
    ) || [], [res?.data])

  const addItem = (productId: string) => {
    if (!productId) return
    const product = res?.data?.find(p => p.id === productId)
    if (!product) return
    if (items.some(i => i.productId === product.id)) return

    form.setValue("items", [
      ...items,
      {
        productId: product.id!,
        name: product.name!,
        price: Number(product.price),
        quantity: 1
      }
    ])

    setSelectedEgg("")
    setSelectedOther("")
  }

  const updateQty = (index: number, delta: number) => {
    const next = items[index].quantity + delta
    if (next < 1) return
    const updated = [...items]
    updated[index] = { ...items[index], quantity: next }
    form.setValue("items", updated)
  }

  const removeItem = (index: number) => {
    const updated = [...items]
    updated.splice(index, 1)
    form.setValue("items", updated)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

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

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" className="h-12" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryStartTime"
            render={() => (
              <FormItem>
                <FormLabel>Delivery Window</FormLabel>
                <Select
                  value={
                    form.watch("deliveryStartTime") &&
                    form.watch("deliveryEndTime")
                      ? `${form.watch("deliveryStartTime")} - ${form.watch("deliveryEndTime")}`
                      : ""
                  }
                  onValueChange={(value) => {
                    const [start, end] = value.split(" - ")
                    form.setValue("deliveryStartTime", start.trim())
                    form.setValue("deliveryEndTime", end.trim())
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</SelectItem>
                    <SelectItem value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</SelectItem>
                    <SelectItem value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
            <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EOrderStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={EOrderStatus.CONFIRMED}>Confirmed</SelectItem>
                  <SelectItem value={EOrderStatus.DELIVERED}>Delivered</SelectItem>
                  <SelectItem value={EOrderStatus.CANCELLED}>Cancelled</SelectItem>
                  <SelectItem value={EOrderStatus.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        </div>

      

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Egg Products</FormLabel>
            <div className="flex gap-2">
              <Select value={selectedEgg} onValueChange={setSelectedEgg}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select egg product" />
                </SelectTrigger>
                <SelectContent>
                  {eggRelated.map(p => (
                    <SelectItem key={p.id} value={p.id!}>
                      {p.name}
                    </SelectItem>
                  ))}
                  {isFetching && (
                    <div className="flex justify-center py-2">
                      <Loader2 className="animate-spin" />
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button type="button" onClick={() => addItem(selectedEgg)} disabled={!selectedEgg}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Other Products</FormLabel>
            <div className="flex gap-2">
              <Select value={selectedOther} onValueChange={setSelectedOther}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select other product" />
                </SelectTrigger>
                <SelectContent>
                  {otherProducts.map(p => (
                    <SelectItem key={p.id} value={p.id!}>
                      {p.name}
                    </SelectItem>
                  ))}
                  {isFetching && (
                    <div className="flex justify-center py-2">
                      <Loader2 className="animate-spin" />
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button type="button" onClick={() => addItem(selectedOther)} disabled={!selectedOther}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {items.map((item, index) => (
          <div
            key={item.productId}
            className="grid grid-cols-[1fr_260px_160px] items-center gap-4 border rounded-md p-2"
          >
            <div className="truncate font-medium">{item.name}</div>

            <div className="flex items-center gap-3 justify-center">
              <Button type="button" size="icon" variant="outline" onClick={() => updateQty(index, -1)}>
                <Minus />
              </Button>
              {isAdmin ? (
                <Input
                  type="number"
                  className="w-20 text-center h-10"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const updated = [...items];
                    updated[index] = { ...items[index], quantity: Math.max(1, val) };
                    form.setValue("items", updated);
                  }}
                />
              ) : (
                <span className="w-8 text-center">{item.quantity}</span>
              )}
              <Button type="button" size="icon" variant="outline" onClick={() => updateQty(index, 1)}>
                <Plus />
              </Button>
            </div>

            <div className="flex justify-end items-center gap-3">
              <span>₹{item.price * item.quantity}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
