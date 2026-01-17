/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

import { loginSchema, LoginFormValues } from '../schema';

interface IAdminLoginForm {
  isLoading: boolean;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onForgot: () => void;
}

export function AdminLoginForm({
  isLoading,
  onSubmit,
  onForgot
}: IAdminLoginForm) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await onSubmit(values);
          } catch (e: any) {
            toast.error(e.message);
          }
        })}
        className="space-y-4 py-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="flex text-start">Email</Label>
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <Label className="flex text-start">Password</Label>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
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
          Sign In
        </Button>

        <button
          type="button"
          onClick={onForgot}
          className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Forgot your password?
        </button>
      </form>
    </Form>
  );
}
