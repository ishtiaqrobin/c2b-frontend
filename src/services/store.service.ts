import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IStore } from "@/types/store.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
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
        error: {
          message: err instanceof Error ? err.message : "Error fetching stores",
        },
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
        error: {
          message: err instanceof Error ? err.message : "Error fetching store",
        },
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
        error: {
          message: err instanceof Error ? err.message : "Error fetching store",
        },
      };
    }
  },

  /** POST /stores */
  create: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IStore | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/stores`, {
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
      const response: ApiResponse<IStore> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error creating store",
        },
      };
    }
  },

  /** PATCH /stores/:id */
  update: async function (
    token: string,
    id: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IStore | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/stores/${id}`, {
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
      const response: ApiResponse<IStore> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error updating store",
        },
      };
    }
  },

  /** DELETE /stores/:id */
  delete: async function (
    token: string,
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/stores/${id}`, {
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
          message: err instanceof Error ? err.message : "Error deleting store",
        },
      };
    }
  },
};
