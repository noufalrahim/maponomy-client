/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

export const uploadData = async <TResponse>(
  url: string,
  data: FormData
): Promise<TResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await axios.post<TResponse>(`${import.meta.env.VITE_BACKEND_API}${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
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
