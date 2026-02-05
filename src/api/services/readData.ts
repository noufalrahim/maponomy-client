/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from "@/types/ApiType";
import apiClient from "../apiClient";
import { AxiosError, isAxiosError } from "axios";

type ReadDataOptions = {
  baseUrl?: string;
  headers?: Record<string, string>;
};

export const readData = async <T>(
  url: string,
  options?: ReadDataOptions
): Promise<T> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw {
      message: "Unauthorized",
      status: 401,
      url,
    } as ApiError;
  }

  const finalUrl = options?.baseUrl
    ? `${options.baseUrl}${url}`
    : url;

  try {
    const response = await apiClient.get<T>(finalUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });

    return response.data;
  } catch (err) {
    if (isAxiosError(err)) {
      const axiosErr = err as AxiosError;

      throw {
        message:
          (axiosErr.response?.data as any)?.error ||
          axiosErr.message ||
          "Request failed",
        status: axiosErr.response?.status || 500,
        data: axiosErr.response?.data,
        headers: axiosErr.response?.headers,
        url: axiosErr.config?.url,
        method: axiosErr.config?.method,
      } as ApiError;
    }

    throw {
      message: "Unknown error",
      status: 500,
      url: finalUrl,
    } as ApiError;
  }
};
