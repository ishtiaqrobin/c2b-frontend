import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  IBanner,
  IBannerListQuery,
  IBannerFormValues,
} from "@/types/banner.type";

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
 * checkAuth middleware can identify the user.  Use this for any endpoint
 * that requires authentication (POST/PATCH/DELETE on banners, etc.).
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

/** Builds the multipart FormData the backend's multer middleware expects. */
export const buildBannerFormData = (values: IBannerFormValues): FormData => {
  const formData = new FormData();
  if (values.image) formData.append("image", values.image);
  if (values.categoryId) formData.append("categoryId", values.categoryId);
  if (values.linkUrl) formData.append("linkUrl", values.linkUrl);
  if (values.sortOrder !== undefined)
    formData.append("sortOrder", String(values.sortOrder));
  if (values.isActive !== undefined)
    formData.append("isActive", String(values.isActive));
  return formData;
};

export const bannerService = {
  /** GET /banners — list (public) */
  getAll: async (
    query?: IBannerListQuery,
  ): Promise<{
    data: IBanner[] | null;
    meta: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> => {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.categoryId) params.set("categoryId", query.categoryId);
      if (query?.isActive) params.set("isActive", query.isActive);

      const url = `${API_URL}/banners${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response: ApiResponse<IBanner[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        meta: null,
        error: errorFrom(err, "Error fetching banners"),
      };
    }
  },

  /** GET /banners/:id — single (public) */
  getById: async (id: string): Promise<ServiceResult<IBanner>> => {
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response: ApiResponse<IBanner> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching banner") };
    }
  },

  /** POST /banners — create (admin), multipart upload */
  create: async (formData: FormData): Promise<ServiceResult<IBanner>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/banners`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IBanner> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error creating banner") };
    }
  },

  /** PATCH /banners/:id — update (admin), multipart upload */
  update: async (
    id: string,
    formData: FormData,
  ): Promise<ServiceResult<IBanner>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/banners/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IBanner> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating banner") };
    }
  },

  /** DELETE /banners/:id — soft delete (admin) */
  delete: async (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/banners/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error deleting banner") };
    }
  },
};
