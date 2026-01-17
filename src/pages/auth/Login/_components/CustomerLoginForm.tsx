import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import z from 'zod';

const customerAuthSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type CustomerAuthFormValues = z.infer<typeof customerAuthSchema>;

interface ICustomerLoginFormProps {
    isLoading: boolean;
    onSubmit: (values: CustomerAuthFormValues) => Promise<void>;
}

export function CustomerLoginForm({
    isLoading,
    onSubmit,
}: ICustomerLoginFormProps) {

    const form = useForm<CustomerAuthFormValues>({
        resolver: zodResolver(customerAuthSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-start flex'>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="your.email@maponomy.com" disabled={isLoading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-start flex'>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" disabled={isLoading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have credentials? Contact your administrator.
                </p>
            </form>
        </Form>
    );
}
