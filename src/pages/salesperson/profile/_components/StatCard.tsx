import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  progress?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden shadow-sm">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary/80" />
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-col items-center gap-1 pt-2">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground text-center">
            {subtitle}
          </p>
        )}

        {progress !== undefined && (
          <div className="w-full pt-3">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {Math.min(progress, 100)}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
