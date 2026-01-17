/* eslint-disable react-hooks/set-state-in-effect */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CustomerOrders } from '../BulkOrder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ITimeslotProps {
  setCustomerOrders: Dispatch<SetStateAction<CustomerOrders[]>>;
  customerId: string;
  customerOrder: CustomerOrders;
}

export default function Timeslot({
  setCustomerOrders,
  customerId,
  customerOrder,
}: ITimeslotProps) {

  const [date, setDate] = useState(customerOrder.deliveryDate || '');
  const [deliveryWindow, setDeliveryWindow] = useState({
    deliveryStartTime: customerOrder.deliveryWindow?.deliveryStartTime || '',
    deliveryEndTime: customerOrder.deliveryWindow?.deliveryEndTime || '',
  });

  useEffect(() => {
    setDate(customerOrder.deliveryDate || '');
    setDeliveryWindow({
      deliveryStartTime: customerOrder.deliveryWindow?.deliveryStartTime || '',
      deliveryEndTime: customerOrder.deliveryWindow?.deliveryEndTime || '',
    });
  }, [customerOrder.deliveryDate, customerOrder.deliveryWindow]);

  const updateParent = (
    nextDate: string,
    nextWindow: typeof deliveryWindow
  ) => {
    if (!nextDate) return;
    if (!nextWindow.deliveryStartTime || !nextWindow.deliveryEndTime) return;

    setCustomerOrders(prev =>
      prev.map(o =>
        o.customer.id === customerId
          ? {
              ...o,
              deliveryDate: nextDate,
              deliveryWindow: nextWindow,
            }
          : o
      )
    );
  };

  return (
    <div className="grid grid-cols-[1fr_1fr] items-end gap-3">
      <div className="space-y-2">
        <Label className="flex text-start">Delivery Date</Label>
        <Input
          type="date"
          value={date}
          onChange={e => {
            const nextDate = e.target.value;
            setDate(nextDate);
            updateParent(nextDate, deliveryWindow);
          }}
          min={new Date().toISOString().split('T')[0]}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex text-start">Delivery Window</Label>
        <Select
          value={
            deliveryWindow.deliveryStartTime && deliveryWindow.deliveryEndTime
              ? `${deliveryWindow.deliveryStartTime} - ${deliveryWindow.deliveryEndTime}`
              : ''
          }
          onValueChange={(value) => {
            const [start, end] = value.split(' - ');
            const nextWindow = {
              deliveryStartTime: start.trim(),
              deliveryEndTime: end.trim(),
            };
            setDeliveryWindow(nextWindow);
            updateParent(date, nextWindow);
          }}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select time slot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</SelectItem>
            <SelectItem value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</SelectItem>
            <SelectItem value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
