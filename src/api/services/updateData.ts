/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import apiClient from "../apiClient";

export const editData = async <TRequest, TResponse>(
  url: string,
  data: TRequest
): Promise<TResponse> => {

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await apiClient.patch<TResponse>(url, data, {
      headers: {
        "Authorization": `Bearer ${token}`,
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
