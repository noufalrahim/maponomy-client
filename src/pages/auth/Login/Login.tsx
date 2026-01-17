/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';

import { AuthHeader } from './_components/AuthHeader';
import { AdminLoginForm } from './_components/AdminLoginForm';
import { AdminForgotForm } from './_components/AdminForgotForm';

import { LoginFormValues, ForgotFormValues } from './schema';
import { SalesLoginForm } from './_components/SalesLoginForm';
import { ERole } from '@/types';
import { CustomerLoginForm } from './_components/CustomerLoginForm';

interface LoginProps {
  type: ERole;
}

export default function Login({ type }: LoginProps) {
  
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  const { signIn, signInLoading } = useAuth();

  // const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    signIn({
      ...values,
      type
    }, {
      onError: (error: any) => {
        console.log("Eror", error);
        toast.error(
          error.message?.includes('Invalid login credentials')
            ? 'Invalid email or password'
            : error.message || 'Login failed'
        );
      },
    });
  };

  const handleForgot = async (values: ForgotFormValues): Promise<void> => {
    console.log(values);
    toast.info('Forgot password flow not implemented yet.');
    setMode('login');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md flex flex-col items-start">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border-border/50 shadow-sm w-full">
          <AuthHeader mode={mode} type={type} />

          <CardContent>
            {mode === 'login' && type === ERole.ADMIN && (
              <AdminLoginForm
                isLoading={signInLoading}
                onSubmit={handleLogin}
                onForgot={() => setMode('forgot')}
              />
            )}

            {mode === 'login' && type === ERole.SALESPERSON && (
              <SalesLoginForm
                isLoading={false}
                onSubmit={handleLogin}
              />
            )}

            {mode === 'forgot' && type === ERole.ADMIN && (
              <AdminForgotForm
                isLoading={false}
                onSubmit={handleForgot}
                onBack={() => setMode('login')}
              />
            )}

            {
              mode === 'login' && type === ERole.CUSTOMER && (
                <CustomerLoginForm
                  isLoading={false}
                  onSubmit={handleLogin}
                />
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
