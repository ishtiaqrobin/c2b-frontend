import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  ICategoryCheckItem,
  ICheckItemQuery,
  ICheckItemCreatePayload,
  ICheckItemUpdatePayload,
} from "@/types/checkItem.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: ServiceError };

const errorFrom = (err: unknown, fallback: string): ServiceError => ({
  message: err instanceof Error ? err.message : fallback,
});

async function fetchWithCookies(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    credentials: "include",
  });
}

export const checkItemService = {
  getByCategory: async (
    categoryId: string,
  ): Promise<{
    data: ICategoryCheckItem[] | null;
    error: ServiceError | null;
  }> => {
    try {
      const res = await fetch(
        `${API_URL}/check-items/category/${categoryId}`,
        { cache: "no-store" },
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ICategoryCheckItem[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching check items"),
      };
    }
  },

  getAll: async (
    query?: ICheckItemQuery,
  ): Promise<{
    data: ICategoryCheckItem[] | null;
    meta: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> => {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.search) params.set("search", query.search);
      if (query?.categoryId) params.set("categoryId", query.categoryId);
      if (query?.isActive) params.set("isActive", query.isActive);

      const url = `${API_URL}/check-items${params.toString() ? `?${params}` : ""}`;
      const res = await fetchWithCookies(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response: ApiResponse<ICategoryCheckItem[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        meta: null,
        error: errorFrom(err, "Error fetching check items"),
      };
    }
  },

  getById: async (
    id: string,
  ): Promise<ServiceResult<ICategoryCheckItem>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/check-items/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ICategoryCheckItem> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching check item"),
      };
    }
  },

  create: async (
    payload: ICheckItemCreatePayload,
  ): Promise<ServiceResult<ICategoryCheckItem>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/check-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICategoryCheckItem> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error creating check item"),
      };
    }
  },

  update: async (
    id: string,
    payload: ICheckItemUpdatePayload,
  ): Promise<ServiceResult<ICategoryCheckItem>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/check-items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICategoryCheckItem> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error updating check item"),
      };
    }
  },

  delete: async (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/check-items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error deleting check item"),
      };
    }
  },
};
