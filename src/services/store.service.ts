import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IStore } from "@/types/store.type";

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

export const storeService = {
  /** GET /stores — List stores */
  getAll: async function (query?: {
    page?: string;
    limit?: string;
    search?: string;
    isActive?: string;
  }): Promise<{
    data: IStore[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.search) params.set("search", query.search);
      if (query?.isActive) params.set("isActive", query.isActive);
      const url = `${API_URL}/stores${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IStore[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching stores"),
      };
    }
  },

  /** GET /stores/:id */
  getById: async function (
    id: string,
  ): Promise<{ data: IStore | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/stores/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IStore> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching store"),
      };
    }
  },

  /** GET /stores/slug/:slug */
  getBySlug: async function (
    slug: string,
  ): Promise<{ data: IStore | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/stores/slug/${slug}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IStore> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching store"),
      };
    }
  },

  /** POST /stores — Create store */
  create: async function (
    payload: Record<string, unknown>,
  ): Promise<ServiceResult<IStore>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/stores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IStore> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error creating store"),
      };
    }
  },

  /** PATCH /stores/:id — Update store */
  update: async function (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<ServiceResult<IStore>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/stores/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IStore> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error updating store"),
      };
    }
  },

  /** DELETE /stores/:id — Soft delete */
  delete: async function (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(`${API_URL}/stores/${id}`, {
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
        error: errorFrom(err, "Error deleting store"),
      };
    }
  },
};
