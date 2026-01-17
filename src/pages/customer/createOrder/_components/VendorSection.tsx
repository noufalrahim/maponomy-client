import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  deliveryDate: string;
  setDeliveryDate: (v: string) => void;
  deliveryWindow: {
    deliveryStartTime: string | null;
    deliveryEndTime: string | null;
  };
  setDeliveryWindow: (v: {
    deliveryStartTime: string | null;
    deliveryEndTime: string | null;
  }) => void;
}

export default function VendorSection({
  deliveryDate,
  setDeliveryDate,
  deliveryWindow,
  setDeliveryWindow,
}: Props) {
  return (
    <Card>
      <CardHeader className='flex items-start'>
        <CardTitle className="text-lg">Customer Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className='flex text-start'>Delivery Date</Label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className='flex text-start'>Delivery Window</Label>
            <Select value={
              deliveryWindow.deliveryStartTime && deliveryWindow.deliveryEndTime ? (
                `${deliveryWindow.deliveryStartTime} - ${deliveryWindow.deliveryEndTime}`
              ) : ""
            } onValueChange={(value) => {
              const [start, end] = value.split(' - ');
              setDeliveryWindow({ deliveryStartTime: start.trim(), deliveryEndTime: end.trim() });
            }}>
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
        </div>
      </CardContent>
    </Card>
  );
}
