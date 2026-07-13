import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  ICategory,
  ICategoryCreatePayload,
  ICategoryUpdatePayload,
} from "@/types/category.type";

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

/**
 * Server-only fetch that forwards the session cookie so the backend's
 * checkAuth middleware can identify the user.
 */
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

export const categoryService = {
  /** GET /categories — List categories */
  getAll: async function (query?: {
    page?: string;
    limit?: string;
    search?: string;
    parentId?: string;
    isActive?: string;
  }): Promise<{
    data: ICategory[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.search) params.set("search", query.search);
      if (query?.parentId) params.set("parentId", query.parentId);
      if (query?.isActive) params.set("isActive", query.isActive);

      const url = `${API_URL}/categories${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ICategory[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching categories",
        },
      };
    }
  },

  /** GET /categories/tree — Get category tree */
  getTree: async function (): Promise<{
    data: ICategory[] | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetch(`${API_URL}/categories/tree`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ICategory[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching category tree",
        },
      };
    }
  },

  /** GET /categories/:id — Get by ID */
  getById: async function (
    id: string,
  ): Promise<{ data: ICategory | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ICategory> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching category",
        },
      };
    }
  },

  /** GET /categories/slug/:slug — Get by slug */
  getBySlug: async function (
    slug: string,
  ): Promise<{ data: ICategory | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/categories/slug/${slug}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ICategory> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching category",
        },
      };
    }
  },

  /** POST /categories — Create category */
  create: async function (
    payload: ICategoryCreatePayload,
  ): Promise<ServiceResult<ICategory>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICategory> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error creating category"),
      };
    }
  },

  /** PATCH /categories/:id — Update category */
  update: async function (
    id: string,
    payload: ICategoryUpdatePayload,
  ): Promise<ServiceResult<ICategory>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICategory> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error updating category"),
      };
    }
  },

  /** DELETE /categories/:id — Soft delete */
  delete: async function (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(`${API_URL}/categories/${id}`, {
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
        error: errorFrom(err, "Error deleting category"),
      };
    }
  },
};
