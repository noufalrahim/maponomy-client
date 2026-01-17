import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ERole } from '@/types';

interface IAuthHeaderProps {
  mode: 'login' | 'forgot';
  type: ERole;
}

export function AuthHeader({ mode, type }: IAuthHeaderProps) {
  return (
    <CardHeader className="text-center pb-2">
      <div className="flex justify-center mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <span className="text-xl font-bold text-primary-foreground">M</span>
        </div>
      </div>
      <CardTitle className="text-2xl">
        {mode === 'login' ? (type === ERole.ADMIN ? 'Admin Login' : type === ERole.SALESPERSON ? 'Sales Login' : type === ERole.CUSTOMER ? 'Customer Login' : 'Login') : 'Reset Password'}
      </CardTitle>
      <CardDescription>
        {mode === 'login'
          ? (type === ERole.ADMIN ? 'Enter your credentials to access the admin dashboard' : type === ERole.SALESPERSON ? 'Enter your credentials to access the sales dashboard' : type === ERole.CUSTOMER ? 'Enter your credentials to access the customer dashboard' : 'Enter your email to receive a password reset link')
          : 'Enter your email to receive a password reset link'}
      </CardDescription>
    </CardHeader>
  );
}
