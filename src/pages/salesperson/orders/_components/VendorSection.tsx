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
import { TCustomer } from '@/types';
import { Loader2 } from 'lucide-react';

interface Props {
  vendors: TCustomer[];
  selectedVendorId: string;
  onVendorChange: (id: string) => void;
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
  isLoading: boolean;
}

export default function VendorSection({
  vendors,
  selectedVendorId,
  onVendorChange,
  deliveryDate,
  setDeliveryDate,
  deliveryWindow,
  isLoading,
  setDeliveryWindow,
}: Props) {

  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  return (
    <Card>
      <CardHeader className='flex items-start'>
        <CardTitle className="text-lg">Customer Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className='flex text-start'>Select Customer</Label>
          <Select value={selectedVendorId} onValueChange={onVendorChange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choose a customer" />
            </SelectTrigger>
            <SelectContent>
              {
                vendors?.length === 0 && (
                  <div className='flex items-center italic text-xs justify-center h-full py-2'>
                    No customers added yet!
                  </div>
                )
              }
              {vendors?.map(v => (
                <SelectItem key={v.id} value={v.id!}>
                  {v.name}
                </SelectItem>
              ))}
              {
                isLoading && (
                  <div className='flex items-center text-primary justify-center h-full py-2'>
                    <Loader2 className="animate-spin" />
                  </div>
                )
              }
            </SelectContent>
          </Select>
        </div>

        {selectedVendor && (
          <div className="p-4 rounded-lg bg-accent/50 text-sm flex items-start flex-col">
            <p className="font-medium">{selectedVendor.name}</p>
            <p className="text-muted-foreground">{selectedVendor.address}</p>
            <p className="text-muted-foreground">
              {selectedVendor.phoneNumber || '-'}
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className='flex text-start'>Delivery Date</Label>
            <Input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              className="h-12"
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
              <SelectTrigger className="h-12">
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
