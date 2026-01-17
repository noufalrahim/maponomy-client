import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Loader } from "@/components/Loader";
import { useReadData } from "@/hooks/useReadData";
import { setUser } from "@/redux/userSlice";
import { ERole, EUrl, TServiceResponse, TUser } from "@/types";

interface IProtectedRouteProps {
  children: React.ReactNode;
  type: ERole;
}

export const ProtectedRoute = ({ children, type }: IProtectedRouteProps) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const { data: res, isLoading } =
    useReadData<TServiceResponse<TUser>>(
      "users",
      `/auth/validate-token`
    );

  useEffect(() => {
    if (res?.success) {
      dispatch(setUser(res?.data));
    }
  }, [res, dispatch]);

  if (!token) {
    return (
      <Navigate
        to={type === ERole.SALESPERSON ? EUrl.SALES_LOGIN : type === ERole.ADMIN ? EUrl.ADMIN_LOGIN : EUrl.CUSTOMER_LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!res?.success) {
    localStorage.removeItem("token");
    return (
      <Navigate
        to={type === ERole.SALESPERSON ? EUrl.SALES_LOGIN : type === ERole.ADMIN ? EUrl.ADMIN_LOGIN : EUrl.CUSTOMER_LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
};
