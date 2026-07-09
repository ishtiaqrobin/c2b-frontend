import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IEkyc } from "@/types/ekyc.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const ekycService = {
  /** GET /ekyc/my — My eKYC status */
  getMyEkyc: async function (
    token: string,
  ): Promise<{ data: IEkyc | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/ekyc/my`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IEkyc> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error fetching eKYC",
        },
      };
    }
  },

  /** POST /ekyc/my/documents — Upload document */
  uploadDocument: async function (
    token: string,
    formData: FormData,
  ): Promise<{ data: IEkyc | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/ekyc/my/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IEkyc> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error uploading document",
        },
      };
    }
  },

  /** DELETE /ekyc/my/documents/:documentId — Remove document */
  removeDocument: async function (
    token: string,
    documentId: string,
  ): Promise<{ data: IEkyc | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/ekyc/my/documents/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IEkyc> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error removing document",
        },
      };
    }
  },

  /** GET /ekyc — List all (admin) */
  getAll: async function (
    token: string,
    query?: { page?: string; limit?: string; status?: string; search?: string },
  ): Promise<{
    data: IEkyc[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.status) params.set("status", query.status);
      if (query?.search) params.set("search", query.search);
      const url = `${API_URL}/ekyc${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IEkyc[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching eKYC records",
        },
      };
    }
  },

  /** PATCH /ekyc/:id/status — Review eKYC (admin) */
  reviewEkyc: async function (
    token: string,
    id: string,
    payload: { status: "VERIFIED" | "REJECTED"; rejectReason?: string },
  ): Promise<{ data: IEkyc | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/ekyc/${id}/status`, {
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
      const response: ApiResponse<IEkyc> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error reviewing eKYC",
        },
      };
    }
  },
};
