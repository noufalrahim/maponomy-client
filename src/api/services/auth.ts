/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERole, SigninDTO, TServiceResponse, TUser } from "@/types";
import apiClient from "../apiClient";
import { AxiosError } from "axios";

export const authSignup = async (data: TUser): Promise<TServiceResponse<TUser>> => {
  try {
    const response = await apiClient.post<TServiceResponse<TUser>>('/auth/signup', data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`An error occurred while signing up: ${message}`);
  }
};

export const authSignin = async (data: SigninDTO, type: ERole): Promise<TServiceResponse<TUser>> => {
  console.log("Data: ", data, type);
  try {
    const response = await apiClient.post<TServiceResponse<TUser>>(
      type === ERole.ADMIN ? '/auth/admin/signin' : '/auth/signin'
      , data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unexpected server error";

    throw new Error(message);
  }
};
