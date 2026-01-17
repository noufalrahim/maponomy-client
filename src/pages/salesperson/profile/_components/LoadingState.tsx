import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingState() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile header skeleton */}
      <Skeleton className="h-32 w-full rounded-xl" />

      {/* Stats grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      {/* Recent orders skeleton */}
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
