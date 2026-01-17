/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pagination metadata returned by backend
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Pagination parameters for requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Backend error response structure
 */
export interface ApiError<T = any> {
  message: string;
  status: number;
  data?: T;
  headers?: any;
  url?: string;
  method?: string;
};
