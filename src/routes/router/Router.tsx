import { Routes, Route } from 'react-router-dom';
import { ERole, EUrl } from '@/types';
import { Login } from '@/pages/auth/Login';
import { Home } from '@/pages/home';
import { Sales } from '@/pages/salesperson/profile';
import { AdminLayout, SalesLayout } from '@/layout/Layout';
import { CreateOrder, OrderHistory } from '@/pages/salesperson/orders';
import { Targets } from '@/pages/salesperson/targets';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { SalesOpsManagement } from '@/pages/admin/SalesOpsManagement';
import { WarehouseManagement } from '@/pages/admin/WarehouseManagement';
import { ProductCatalog } from '@/pages/admin/ProductCatalog';
import { OrdersManagement } from '@/pages/admin/OrderManagement';
import { TargetsManagement } from '@/pages/admin/TargetsManagement';
import { ImportExport } from '@/pages/admin/ImportExport';
import { ProtectedRoute } from '../ProtectedRoutes/ProtectedRoutes';
import { CustomerManagement } from '@/pages/admin/VendorManagement';
import { StaffManagement, WarehouseManagers } from '@/pages/admin/StaffManagement';
import { CustomerOrders } from '@/pages/salesperson/customerOrders';
import { CustomerLayout } from '@/layout/Layout/CustomerLayout';
import { Orders } from '@/pages/customer/orders';
import { ManageCreateOrder } from '@/pages/customer/createOrder';
import { CustomerDashboard } from '@/pages/customer/dashboard';
import { BulkOrder } from '@/pages/salesperson/bulkOrder';

export default function Router() {

    return (
        <Routes>
            <Route path={EUrl.HOME} element={<Home />} />
            <Route path={EUrl.SALES}
                element={
                    <ProtectedRoute type={ERole.SALESPERSON}>
                        <SalesLayout />
                    </ProtectedRoute>
                }
            >
                <Route path={EUrl.SALES} index element={<Sales />} />
                <Route path={EUrl.SALES_ORDERS} element={<OrderHistory />} />
                <Route path={EUrl.SALES_TARGETS} element={<Targets />} />
                <Route path={EUrl.SALES_NEW_ORDER} element={<CreateOrder />} />
                <Route path={EUrl.SALES_CUSTOMER_ORDERS} element={<CustomerOrders />} />
                <Route path={EUrl.SALES_BULK_ORDER} element={<BulkOrder />} />
            </Route>
            <Route path={EUrl.ADMIN_DASHBOARD} element={
                <ProtectedRoute type={ERole.ADMIN}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<AdminDashboard />} />
                <Route path={EUrl.ADMIN_SALES_PERSON} element={<SalesOpsManagement />} />
                <Route path={EUrl.ADMIN_STAFF_MANAGEMENT} element={<StaffManagement />} />
                <Route path={EUrl.ADMIN_WAREHOUSE_MANAGERS} element={<WarehouseManagers />} />
                <Route path={EUrl.ADMIN_CUSTOMERS} element={<CustomerManagement />} />
                <Route path={EUrl.ADMIN_WAREHOUSES} element={<WarehouseManagement />} />
                <Route path={EUrl.ADMIN_PRODUCTS} element={<ProductCatalog />} />
                <Route path={EUrl.ADMIN_ORDERS} element={<OrdersManagement />} />
                <Route path={EUrl.ADMIN_TARGETS} element={<TargetsManagement />} />
                <Route path={EUrl.ADMIN_IMPORT_EXPORT} element={<ImportExport />} />
            </Route>

            <Route path={EUrl.CUSTOMER}
                element={
                    <ProtectedRoute type={ERole.CUSTOMER}>
                        <CustomerLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<CustomerDashboard />} />
                <Route path={EUrl.CUSTOMER_ORDERS} element={<Orders />} />
                <Route path={EUrl.CUSTOMER_ORDER_NEW} element={<ManageCreateOrder />} />
            </Route>

            <Route path={EUrl.SALES_LOGIN} element={<Login type={ERole.SALESPERSON} />} />
            <Route path={EUrl.ADMIN_LOGIN} element={<Login type={ERole.ADMIN} />} />
            <Route path={EUrl.CUSTOMER_LOGIN} element={<Login type={ERole.CUSTOMER} />} />
            <Route path={EUrl.WAREHOUSE_MANAGER_LOGIN} element={<Login type={ERole.WAREHOUSE_MANAGER} />} />
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
}