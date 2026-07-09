/** Generic pagination meta returned by backend */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
}

/** Generic API response wrapper from backend */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/** Standard service error structure */
export interface ServiceError {
  message: string;
}

/** Standard service result type */
export type ServiceResult<T> = Promise<{
  data: T | null;
  error: ServiceError | null;
}>;
