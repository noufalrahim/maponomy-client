import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EUrl } from '@/types';

const navigation = [
  { name: 'Dashboard', href: EUrl.CUSTOMER, icon: LayoutDashboard },
  { name: 'Place Order', href: EUrl.CUSTOMER_ORDER_NEW, icon: ShoppingCart },
  { name: 'My Orders', href: EUrl.CUSTOMER_ORDERS, icon: ClipboardList },
];

export function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
//   const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 bg-gray-50',
          collapsed ? 'w-[72px]' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link to={EUrl.CUSTOMER} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary flex-shrink-0">
              <span className="text-lg font-bold text-sidebar-primary-foreground">M</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground">Customer Portal</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-sidebar-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            let isActive = false;
            if(item.name === 'Dashboard') {
              isActive = location.pathname === EUrl.CUSTOMER;
            } else if(item.name === 'Place Order') {
              isActive = location.pathname === EUrl.CUSTOMER_ORDER_NEW;
            } else if(item.name === 'My Orders') {
              isActive = location.pathname === EUrl.CUSTOMER_ORDERS;
            }
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-gray-500'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn('min-h-screen transition-all duration-300', collapsed ? 'lg:pl-[72px]' : 'lg:pl-64')}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              {navigation.find((n) =>
                n.href === '/customer'
                  ? location.pathname === '/customer'
                  : location.pathname.startsWith(n.href)
              )?.name || 'Customer Portal'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* {vendorInfo?.storePhotoUrl ? (
              <img 
                src={vendorInfo.storePhotoUrl} 
                alt={vendorInfo?.name || 'Store'} 
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {vendorInfo?.name?.charAt(0) || 'C'}
              </div>
            )}
            {vendorInfo?.name && (
              <span className="hidden sm:block text-sm font-medium text-foreground">
                {vendorInfo.name}
              </span>
            )} */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
