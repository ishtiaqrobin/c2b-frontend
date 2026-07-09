import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IBanner } from "@/types/banner.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const bannerService = {
  /** GET /banners — List banners (public) */
  getAll: async function (query?: {
    page?: string;
    limit?: string;
    categoryId?: string;
    isActive?: string;
  }): Promise<{
    data: IBanner[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.categoryId) params.set("categoryId", query.categoryId);
      if (query?.isActive) params.set("isActive", query.isActive);
      const url = `${API_URL}/banners${params.toString() ? `?${params.toString()}` : ""}`;
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
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching banners",
        },
      };
    }
  },

  /** GET /banners/:id */
  getById: async function (
    id: string,
  ): Promise<{ data: IBanner | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IBanner> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error fetching banner",
        },
      };
    }
  },

  /** POST /banners — Create (admin) */
  create: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IBanner | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/banners`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IBanner> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error creating banner",
        },
      };
    }
  },

  /** PATCH /banners/:id — Update (admin) */
  update: async function (
    token: string,
    id: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IBanner | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IBanner> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error updating banner",
        },
      };
    }
  },

  /** DELETE /banners/:id — Soft delete (admin) */
  delete: async function (
    token: string,
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error deleting banner",
        },
      };
    }
  },
};
