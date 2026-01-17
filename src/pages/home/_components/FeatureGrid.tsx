import { Package, Users, TrendingUp } from "lucide-react";
import FeatureCard from "./FeatureCard";

export default function FeatureGrid() {
  return (
    <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            to="/salesperson/orders/new"
            icon={Package}
            title="Quick Order Entry"
            description="Create vendor orders in under 60 seconds with auto-filled pricing."
          />

          <FeatureCard
            to="/admin/vendors"
            icon={Users}
            title="Customer Management"
            description="Track vendor relationships, assignments, and order history."
          />

          <FeatureCard
            to="/admin"
            icon={TrendingUp}
            title="Real-time Analytics"
            description="Monitor sales performance, targets, and revenue insights."
          />
        </div>
      </div>
    </section>
  );
}
