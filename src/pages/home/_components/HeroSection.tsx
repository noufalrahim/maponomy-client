import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart, LayoutDashboard, ArrowRight, Users2 } from "lucide-react";
import { EUrl } from "@/types";

export default function HeroSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight animate-fade-in">
          B2B Order
          <span className="text-primary"> Management</span>
        </h1>

        <p
          className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          Digitize vendor orders, track sales performance, and manage your
          poultry distribution business with ease.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <Link to={EUrl.SALES} className="w-full sm:w-auto">
            <Button size="lg" className="h-14 w-full sm:w-auto px-8 text-base">
              <ShoppingCart className="h-5 w-5" />
              Sales Ops Portal
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Link to={EUrl.ADMIN_DASHBOARD} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full sm:w-auto px-8 text-base"
            >
              <LayoutDashboard className="h-5 w-5" />
              Admin Dashboard
            </Button>
          </Link>
          <Link to={EUrl.CUSTOMER} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full sm:w-auto px-8 text-base bg-gray-100 border-none"
            >
              <Users2 className="h-5 w-5" />
              Customer Portal
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
