import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useReadData } from './useReadData';
import { ERole, EUrl, TServiceResponse, TUser } from '@/types';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { setUser } from '@/redux/userSlice';
import { authSignin, authSignup } from '@/api/services/auth';
import { toast } from 'sonner';

export function useAuth() { 
  const navigate = useNavigate();

  const queryClient = new QueryClient();
  /* ----------------------------- Session ----------------------------- */

  // const {
  //   data,
  //   isLoading: isSessionLoading,
  //   error: sessionError,
  //   refetch
  // } = useReadData<TServiceResponse<TUser>>('auth-me', '/auth/me');

  /* ----------------------------- Signup ------------------------------ */

  const signUpMutation = useMutation<TServiceResponse<TUser>, Error, TUser>({
    mutationFn: (data) => authSignup(data),
    onSuccess: (res) => {
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem('token', res.data.token ?? '');
        localStorage.setItem('userRole', res.data.role ?? '');
        navigate('/');
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || 'Signup failed. Please try again.');
    }
  });

  /* ----------------------------- Signin ------------------------------ */

  const signInMutation = useMutation<TServiceResponse<TUser>, Error, TUser & {type: ERole}>({
    mutationFn: (data) => authSignin({
      email: data.email!,
      password: data.password!
    }, data.type),
    onSuccess: (res) => {
      if (res?.data) {
        setUser(res?.data);
        localStorage.setItem('token', res?.data?.token ?? '');
        localStorage.setItem('userRole', res?.data?.role ?? '');
        console.log("RES: ", res?.data);
        if(res?.data?.role === ERole.SALESPERSON){
          navigate(EUrl.SALES)
        }
        else if(res?.data?.role === ERole.ADMIN || res?.data?.role === ERole.WAREHOUSE_MANAGER){
          navigate(EUrl.ADMIN_DASHBOARD)
        }
        else if(res?.data?.role === ERole.CUSTOMER){
          navigate(EUrl.CUSTOMER)
        }
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || 'Signin failed. Please try again.');
    }
  });

  /* ----------------------------- Helpers ----------------------------- */

  // const getMe = useCallback(async () => {
  //   await refetch();
  //   return data;
  // }, [refetch, data]);

  /* ------------------------------ Logout ----------------------------- */

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate(EUrl.HOME);
    queryClient.clear();
  }, [navigate]);

  /* ------------------------------ Return ----------------------------- */

  return {
    /* session */
    // user: data?.data ?? null,
    // isSessionLoading,
    // sessionError,

    /* mutations */
    signUp: signUpMutation.mutate,
    signUpLoading: signUpMutation.isPending,
    signUpError: signUpMutation.error,

    signIn: signInMutation.mutate,
    signInLoading: signInMutation.isPending,
    signInError: signInMutation.error,

    /* helpers */
    // getMe,
    signOut
  };
}
