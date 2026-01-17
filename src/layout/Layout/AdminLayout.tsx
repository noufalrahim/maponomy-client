import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ClipboardList,
  Target,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Warehouse,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EUrl } from '@/types';

const navigation = [
  { name: 'Dashboard', href: EUrl.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { name: 'Sales Ops', href: EUrl.ADMIN_SALES_PERSON, icon: Users },
  { name: 'Customers', href: EUrl.ADMIN_CUSTOMERS, icon: Store },
  { name: 'Warehouses', href: EUrl.ADMIN_WAREHOUSES, icon: Warehouse },
  { name: 'Products', href: EUrl.ADMIN_PRODUCTS, icon: Package },
  { name: 'Orders', href: EUrl.ADMIN_ORDERS, icon: ClipboardList },
  { name: 'Targets', href: EUrl.ADMIN_TARGETS, icon: Target },
  { name: 'Import/Export', href: EUrl.ADMIN_IMPORT_EXPORT, icon: FileSpreadsheet },
];

interface AdminLayoutProps {
  userEmail?: string;
}

export default function AdminLayout({ userEmail }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
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
          <Link to={EUrl.ADMIN_DASHBOARD} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary flex-shrink-0">
              <span className="text-lg font-bold text-white">M</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-sidebar-foreground">Maponomy</span>
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
            const isActive =
              item.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.href);
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

      <div className={cn('min-h-screen transition-all duration-300', collapsed ? 'lg:pl-[72px]' : 'lg:pl-64')}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-start">
            <h1 className="text-lg font-semibold text-foreground">
              {navigation.find((n) =>
                n.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(n.href)
              )?.name || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                {userEmail}
              </span>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              A
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
