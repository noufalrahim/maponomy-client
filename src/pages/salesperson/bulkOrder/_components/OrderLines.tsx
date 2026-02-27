import { Minus, Plus, Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { CustomerOrders } from '../BulkOrder';

export default function OrderLines({
  customerOrder,
  setCustomerOrders,
}: {
  customerOrder: CustomerOrders;
  setCustomerOrders: Dispatch<SetStateAction<CustomerOrders[]>>;
}) {
  if (!customerOrder.orderLines.length) return null;

  const updateQty = (productId: string, nextQty: number) => {
    setCustomerOrders(v =>
      v.map(o =>
        o.customer.id !== customerOrder.customer.id
          ? o
          : {
            ...o,
            orderLines:
              nextQty < 0
                ? o.orderLines.filter(l => l.productId !== productId)
                : o.orderLines.map(l =>
                  l.productId === productId
                    ? {
                      ...l,
                      quantity: nextQty,
                      lineTotal: nextQty * (l.unitPrice || 0),
                    }
                    : l
                ),
          }
      )
    );
  };

  return (
    <div className="space-y-3 border-t border-gray-200 pt-4">
      {customerOrder.orderLines.map(l => (
        <div
          key={l.productId as string}
          className="flex items-center justify-between border rounded-md p-3"
        >
          <div className="w-1/2 text-left">
            <p className="font-medium">{l.productName}</p>
            <p className="text-xs text-gray-500">₹{l.unitPrice}</p>
          </div>

          <div className="w-1/2 flex items-center justify-end gap-4">
            <div className="flex items-center gap-2 w-28 justify-center">
              <button
                className="border p-1 rounded hover:bg-gray-100 rounded-md"
                onClick={() =>
                  updateQty(l.productId as string, (l.quantity || 0) - 1)
                }
                disabled={(l.quantity || 0) <= 0}
              >
                <Minus size={12} />
              </button>

              <input
                className="w-16 text-left border rounded-md h-8 px-1"
                type="number"
                min="0"
                value={l.quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    updateQty(l.productId as string, val);
                  } else if (e.target.value === "") {
                    updateQty(l.productId as string, 0);
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val) || val < 0) {
                    updateQty(l.productId as string, 0);
                  }
                }}
              />

              <button
                className="border p-1 rounded hover:bg-gray-100 rounded-md"
                onClick={() =>
                  updateQty(l.productId as string, (l.quantity || 0) + 1)
                }
              >
                <Plus size={12} />
              </button>
            </div>

            <span className="w-20 text-right font-semibold text-gray-700">
              ₹{(l.quantity || 0) * (l.unitPrice || 0)}
            </span>

            <button
              className="text-gray-500 hover:text-red-500"
              onClick={() => updateQty(l.productId as string, -1)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
