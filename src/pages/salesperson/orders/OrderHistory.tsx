import { useState } from 'react';
import { OrdersHeader } from './_components';
import OrdersFilters from './_components/OrdersFilters';
import OrdersList from './_components/OrderList';
import { useReadData } from '@/hooks/useReadData';
import { TOrder, TServiceResponse } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Loader } from '@/components/Loader';

export default function OrderHistory() {

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const user = useSelector((state: RootState) => state.user.entity);


    const { data: orders, isFetching } = useReadData<TServiceResponse<TOrder[]>>('salesperson_orders_fetch', `/orders/salesperson/${user?.salesperson?.id}`);


    const filteredOrders = orders?.data?.filter(order => {
        const matchesSearch =
            order?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order?.id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order?.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    if (isFetching) {
        return <Loader />
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <OrdersHeader total={orders?.data?.length || 0} />
            <OrdersFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                orders={orders?.data || []}
            />
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No orders found matching your criteria.</p>
                </div>
            ) : (
                <OrdersList orders={filteredOrders} />
            )}
        </div>
    );
}
