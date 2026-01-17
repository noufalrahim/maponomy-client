import { Dispatch, SetStateAction, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomerOrders } from '../BulkOrder';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface Props {
  setCustomerOrders: Dispatch<SetStateAction<CustomerOrders[]>>;
}

export default function GlobalDeliverySettings({ setCustomerOrders }: Props) {

  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryWindow, setDeliveryWindow] = useState<{
    deliveryStartTime: string | null;
    deliveryEndTime: string | null;
  }>({
    deliveryStartTime: null,
    deliveryEndTime: null,
  });

  const applyToAll = () => {
    if (!deliveryDate || !deliveryWindow.deliveryStartTime || !deliveryWindow.deliveryEndTime) {
      toast.error('Please select both delivery date and time window');
      return;
    }

    setCustomerOrders(v =>
      v.map(o => ({
        ...o,
        deliveryDate,
        deliveryWindow: {
          deliveryStartTime: deliveryWindow.deliveryStartTime!,
          deliveryEndTime: deliveryWindow.deliveryEndTime!,
        },
      }))
    );

    toast.success('Delivery applied to all stores');
  };

  return (
    <Card>
      <CardHeader className="flex items-start">
        <CardTitle>Quick Apply Delivery</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-4">
          <div className="space-y-2">
            <Label className="flex text-start">Delivery Date</Label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
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
                setDeliveryWindow({
                  deliveryStartTime: start.trim(),
                  deliveryEndTime: end.trim(),
                });
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9:00 AM - 12:00 PM">
                  9:00 AM - 12:00 PM
                </SelectItem>
                <SelectItem value="12:00 PM - 3:00 PM">
                  12:00 PM - 3:00 PM
                </SelectItem>
                <SelectItem value="3:00 PM - 6:00 PM">
                  3:00 PM - 6:00 PM
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="secondary"
            onClick={applyToAll}
            className="h-10 px-6"
          >
            Apply to All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
