import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { forgotSchema, ForgotFormValues } from '../schema';

interface IAdminForgotFormProps  {
  isLoading: boolean;
  onSubmit: (values: ForgotFormValues) => Promise<void>;
  onBack: () => void;
}

export function AdminForgotForm({
  isLoading,
  onSubmit,
  onBack
}: IAdminForgotFormProps) {
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label>Email</Label>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@maponomy.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Link
        </Button>

        <button
          type="button"
          onClick={onBack}
          className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Back to login
        </button>
      </form>
    </Form>
  );
}
