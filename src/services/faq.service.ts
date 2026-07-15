import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IFaq, IFaqListQuery } from "@/types/faq.type";

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

export const faqService = {
  getAll: async (
    query?: IFaqListQuery,
  ): Promise<{
    data: IFaq[] | null;
    meta: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> => {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.isActive) params.set("isActive", query.isActive);

      const url = `${API_URL}/faqs${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response: ApiResponse<IFaq[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        meta: null,
        error: errorFrom(err, "Error fetching FAQs"),
      };
    }
  },

  getById: async (id: string): Promise<ServiceResult<IFaq>> => {
    try {
      const res = await fetch(`${API_URL}/faqs/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const response: ApiResponse<IFaq> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching FAQ") };
    }
  },

  create: async (data: Partial<IFaq>): Promise<ServiceResult<IFaq>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IFaq> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error creating FAQ") };
    }
  },

  update: async (
    id: string,
    data: Partial<IFaq>,
  ): Promise<ServiceResult<IFaq>> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IFaq> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating FAQ") };
    }
  },

  delete: async (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> => {
    try {
      const res = await fetchWithCookies(`${API_URL}/faqs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error deleting FAQ") };
    }
  },
};
