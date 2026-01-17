/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "@/types/ApiType";
import apiClient from "../apiClient";
import { AxiosError, isAxiosError } from "axios";

export const readData = async <T>(url: string): Promise<T> => {
  const token = localStorage.getItem("token");
  if (!token) {
    const err: ApiError = {
      message: "Unauthorized",
      status: 401,
      url,
    };
    throw err;
  }

  try {
    const response = await apiClient.get<T>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError;

      const apiError: ApiError = {
        message:
          (axiosErr.response?.data as any).error ||
          axiosErr.message ||
          "Request failed",
        status: axiosErr.response?.status || 500,
        data: axiosErr.response?.data,
        headers: axiosErr.response?.headers,
        url: axiosErr.config?.url,
        method: axiosErr.config?.method,
      };

      throw apiError;
    }

    throw {
      message: "Unknown error",
      status: 500,
      url,
    } as ApiError;
  }
};