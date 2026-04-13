import { ERole } from "./enums/ERole";
import { TCustomer } from "./TCustomer";
import { TSalesPerson } from "./TSalesPerson";

export type TUser = {
  id?: string;
  email?: string;
  password?: string;
  token?: string;
  role?: ERole;
  salesperson?: TSalesPerson;
  vendor?: TCustomer;
  customer?: TCustomer;
  warehouseId?: string;
  isActive?: boolean;
}

export type SigninDTO = {
  email: string;
  password: string;
}