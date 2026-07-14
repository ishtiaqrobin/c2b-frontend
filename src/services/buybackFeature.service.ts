import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  IBuybackFeature,
  IBuybackFeatureQuery,
  IBuybackFeatureFormValues,
} from "@/types/buybackFeature.type";

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

export const buildBuybackFeatureFormData = (
  values: IBuybackFeatureFormValues,
): FormData => {
  const formData = new FormData();
  if (values.image) formData.append("image", values.image);
  if (values.title) formData.append("title", values.title);
  if (values.description) formData.append("description", values.description);
  if (values.sortOrder !== undefined)
    formData.append("sortOrder", String(values.sortOrder));
  return formData;
};

export const buybackFeatureService = {
  getAll: async (
    query?: IBuybackFeatureQuery,
  ): Promise<{
    data: IBuybackFeature[] | null;
    meta: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> => {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);

      const url = `${API_URL}/buyback-features${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response: ApiResponse<IBuybackFeature[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        meta: null,
        error: errorFrom(err, "Error fetching buyback features"),
      };
    }
  },

  getById: async (id: string): Promise<ServiceResult<IBuybackFeature>> => {
    try {
      const res = await fetch(`${API_URL}/buyback-features/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response: ApiResponse<IBuybackFeature> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching buyback feature"),
      };
    }
  },

  create: async (
    formData: FormData,
  ): Promise<ServiceResult<IBuybackFeature>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/buyback-features`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IBuybackFeature> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error creating buyback feature"),
      };
    }
  },

  update: async (
    id: string,
    formData: FormData,
  ): Promise<ServiceResult<IBuybackFeature>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/buyback-features/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IBuybackFeature> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error updating buyback feature"),
      };
    }
  },

  delete: async (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/buyback-features/${id}`, {
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
        error: errorFrom(err, "Error deleting buyback feature"),
      };
    }
  },
};
