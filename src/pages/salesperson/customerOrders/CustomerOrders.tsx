import { Fragment, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { OrderItemsRow } from './_components/OrderItemsRow';
import { EOrderStatus, EUrl, TOrder, TServiceResponse } from '@/types';
import { useReadData } from '@/hooks/useReadData';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@/components/Loader';
import { badgeFields, cn } from '@/lib/utils';
import { DialogModal } from '@/components/DialogModal';
import { useModifyData } from '@/hooks/useModifyData';
import { toast } from 'sonner';

const END_POINT = '/orders';

export default function CustomerOrders() {
  const [search, setSearch] = useState<string>('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openWarn, setOpenWarn] = useState<boolean>(false);
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TOrder | null>(null);

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.entity);

  const salespersonId = user?.salesperson?.id;

  const { data: orders, isFetching, refetch } =
    useReadData<TServiceResponse<TOrder[]>>(
      'orders',
      salespersonId ? `${END_POINT}/customer/${salespersonId}` : null
    );

  const { mutate: updateOrder, isPending } = useModifyData<TOrder & { id: string }, TServiceResponse<TOrder>>(END_POINT);


  useEffect(() => {
    if (user && !user.salesperson) {
      navigate(EUrl.SALES_LOGIN, { replace: true });
    }
  }, [user, navigate]);

  if (isFetching) {
    return <Loader />;
  }

  const filtered =
    orders?.data?.filter(o =>
      o.id!.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const handleApprove = () => {
    if (!selectedItem || !selectedItem.id) {
      toast.error("An error occured!");
      return;
    }
    updateOrder(
      {
        id: selectedItem.id,
        status: EOrderStatus.CONFIRMED
      },
      {
        onSuccess: (res) => {
          if (res && res.success) {
            toast.success("Order approved successfully!");
            setOpenWarn(false);
            setSelectedItem(null);
            refetch();
          } else {
            toast.error("Failed to approve order!");
          }
        },
        onError: () => {
          toast.error("Failed to approve order!");
        }
      }
    )
  }

  const handleReject = () => {
    if (!selectedItem || !selectedItem.id) {
      toast.error("An error occured!");
      return;
    }
    updateOrder(
      {
        id: selectedItem.id,
        status: EOrderStatus.REJECTED
      },
      {
        onSuccess: (res) => {
          if (res && res.success) {
            toast.success("Order rejected successfully!");
            setOpenWarn(false);
            setSelectedItem(null);
            refetch();
          } else {
            toast.error("Failed to reject order!");
          }
        },
        onError: () => {
          toast.error("Failed to reject order!");
        }
      }
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="items-start flex flex-col">
          <h1 className="text-2xl font-bold">Customer Orders</h1>
          <p className="text-muted-foreground">
            {filtered.length} total order(s)
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-center">Customer</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!isFetching && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <p className="text-sm font-medium text-foreground">
                        No orders found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {filtered.map(order => (
                <Fragment key={order.id}>
                  <TableRow>
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setExpanded(expanded === order.id! ? null : order.id!)
                        }
                      >
                        {expanded === order.id ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </TableCell>

                    <TableCell className="text-center">{order.id}</TableCell>
                    <TableCell className="text-center">
                      {order.customer?.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {order.createdAt}
                    </TableCell>
                    <TableCell className="text-center">
                      ₹{order.totalAmount}
                    </TableCell>
                    <TableCell className="text-center">
                      {/* <Badge variant="outline">{order.status}</Badge> */}
                      <Badge className={cn('cursor-pointer', badgeFields(order?.status as EOrderStatus).textColor, badgeFields(order?.status as EOrderStatus).bgColor)}>
                        {badgeFields(order?.status as EOrderStatus).text}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {
                        order.status === EOrderStatus.PENDING && (
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" onClick={() => {
                              setSelectedItem(order);
                              setIsApprove(true);
                              setOpenWarn(true);
                            }}>
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                              setSelectedItem(order);
                              setIsApprove(false);
                              setOpenWarn(true);
                            }}>
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )
                      }
                      {
                        order.status === EOrderStatus.CONFIRMED && (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            Confirmed Order
                          </div>
                        )
                      }
                      {
                        order.status === EOrderStatus.REJECTED && (
                          <div className="flex items-center justify-center gap-2 text-red-400">
                            Rejected Order
                          </div>
                        )
                      }
                    </TableCell>
                  </TableRow>

                  {expanded === order.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-muted/40 p-0">
                        <OrderItemsRow order={order} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DialogModal
        open={openWarn}
        onOpenChange={setOpenWarn}
        title={isApprove ? 'Approve Order' : 'Reject Order'}
        onCancel={() => setOpenWarn(false)}
        onConfirm={() => isApprove ? handleApprove() : handleReject()}
        confirmText={isApprove ? 'Approve' : 'Reject'}
        isDelete={!isApprove}
        isLoading={isPending}
      >
        <div className='items-center flex flex-col py-5'>
          <h1>Are you sure you want to {isApprove ? 'approve' : 'reject'} this order?</h1>
          <p>This action cannot be undone.</p>
        </div>
      </DialogModal>
    </div>
  );
}
