import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  to,
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Link to={to} className="block">
      <div className="p-6 rounded-xl border bg-card shadow-xs hover:border-primary/30 transition-all group items-start flex flex-col text-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
          {title}
        </h3>

        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
