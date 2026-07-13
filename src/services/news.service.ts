import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { INews, INewsCreatePayload, INewsUpdatePayload } from "@/types/news.type";

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

export const newsService = {
  /** GET /news — List news (public) */
  getAll: async function (query?: {
    page?: string;
    limit?: string;
    isActive?: string;
    search?: string;
  }): Promise<{
    data: INews[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.isActive) params.set("isActive", query.isActive);
      if (query?.search) params.set("search", query.search);
      const url = `${API_URL}/news${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, { credentials: "include", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<INews[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "Error fetching news" },
      };
    }
  },

  /** GET /news/latest — Get latest news (public) */
  getLatest: async function (): Promise<{
    data: INews[] | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetch(`${API_URL}/news/latest`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<INews[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "Error fetching latest news" },
      };
    }
  },

  /** GET /news/:id */
  getById: async function (
    id: string,
  ): Promise<{ data: INews | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/news/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<INews> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: { message: err instanceof Error ? err.message : "Error fetching news" },
      };
    }
  },

  /** POST /news — Create (admin) */
  create: async function (
    payload: INewsCreatePayload,
  ): Promise<ServiceResult<INews>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<INews> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error creating news") };
    }
  },

  /** PATCH /news/:id — Update (admin) */
  update: async function (
    id: string,
    payload: INewsUpdatePayload,
  ): Promise<ServiceResult<INews>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/news/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<INews> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating news") };
    }
  },

  /** DELETE /news/:id — Soft delete (admin) */
  delete: async function (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(`${API_URL}/news/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error deleting news") };
    }
  },
};
