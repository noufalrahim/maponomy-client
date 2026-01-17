import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CreateOrderHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold">Create Order</h1>
        <p className="text-muted-foreground">Quick order entry</p>
      </div>
    </div>
  );
}
