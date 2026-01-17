import { Card, CardContent } from '@/components/ui/card';

export default function EmptyProfile() {
  return (
    <div className="py-12 flex justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="py-10 text-center space-y-2">
          <p className="text-lg font-medium text-foreground">
            Profile not found
          </p>
          <p className="text-sm text-muted-foreground">
            Your sales profile is not yet set up. Please contact an administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
