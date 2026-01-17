import { ShoppingCart, CheckCircle, TrendingUp, Package } from 'lucide-react'
import StatCard from './StatCard'
import { TProduct } from '@/types'

interface IDashboardStats {
  totalOrders: number
  approvedOrders: number
  rejectedOrders: number
  pendingOrders: number
  totalSpent: number
  frequentProducts: TProduct[]
}

export default function StatsGrid({ stats }: { stats: IDashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        subtitle="This month"
        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
      />

      <StatCard
        title="Approved"
        value={stats.approvedOrders}
        subtitle="Orders approved"
        valueClass="text-green-600"
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
      />

      <StatCard
        title="Pending"
        value={stats.pendingOrders}
        subtitle="Awaiting approval"
        valueClass="text-yellow-600"
        icon={<Package className="h-4 w-4 text-yellow-500" />}
      />

      <StatCard
        title="Total Spent"
        value={`₹${stats.totalSpent.toLocaleString()}`}
        subtitle="This month"
        valueClass="text-primary"
        icon={<TrendingUp className="h-4 w-4 text-primary" />}
      />
    </div>
  )
}
