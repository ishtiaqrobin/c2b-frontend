import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  ICategory,
  ICategoryCreatePayload,
  ICategoryUpdatePayload,
  ICategoryFormValues,
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

/** Build multipart FormData for category create/update (matching backend multer). */
export const buildCategoryFormData = (values: ICategoryFormValues): FormData => {
  const formData = new FormData();
  if (values.image) formData.append("image", values.image);
  if (values.parentId) formData.append("parentId", values.parentId);
  if (values.sortOrder !== undefined)
    formData.append("sortOrder", String(values.sortOrder));
  if (values.isPopular !== undefined)
    formData.append("isPopular", String(values.isPopular));
  if (values.isActive !== undefined)
    formData.append("isActive", String(values.isActive));
  formData.append("slug", values.slug);
  formData.append("name", values.name);
  return formData;
};

export const categoryService = {
  /** GET /categories — List categories */
  getAll: async function (query?: {
    page?: string;
    limit?: string;
    search?: string;
    parentId?: string;
    isPopular?: string;
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
      if (query?.isPopular) params.set("isPopular", query.isPopular);
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

  /** POST /categories — Create category (multipart FormData) */
  create: async function (
    payload: FormData | ICategoryCreatePayload,
  ): Promise<ServiceResult<ICategory>> {
    try {
      const isFormData = payload instanceof FormData;
      const res = await fetchWithCookies(`${API_URL}/categories`, {
        method: "POST",
        ...(isFormData ? {} : { headers: { "Content-Type": "application/json" } }),
        body: isFormData ? payload : JSON.stringify(payload),
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

  /** PATCH /categories/:id — Update category (multipart FormData) */
  update: async function (
    id: string,
    payload: FormData | ICategoryUpdatePayload,
  ): Promise<ServiceResult<ICategory>> {
    try {
      const isFormData = payload instanceof FormData;
      const res = await fetchWithCookies(`${API_URL}/categories/${id}`, {
        method: "PATCH",
        ...(isFormData ? {} : { headers: { "Content-Type": "application/json" } }),
        body: isFormData ? payload : JSON.stringify(payload),
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

  /** GET /categories/trash — List soft-deleted categories */
  getTrash: async function (): Promise<{
    data: ICategory[] | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetchWithCookies(`${API_URL}/categories/trash`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICategory[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching trash"),
      };
    }
  },

  /** POST /categories/:id/restore — Restore a soft-deleted category */
  restore: async function (
    id: string,
    slug?: string,
  ): Promise<ServiceResult<ICategory>> {
    try {
      const body: Record<string, string> = {};
      if (slug) body.slug = slug;
      const res = await fetchWithCookies(`${API_URL}/categories/${id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
        error: errorFrom(err, "Error restoring category"),
      };
    }
  },

  /** DELETE /categories/:id/permanent — Permanently delete */
  permanentDelete: async function (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/categories/${id}/permanent`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error permanently deleting category"),
      };
    }
  },
};
