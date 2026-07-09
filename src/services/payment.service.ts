import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IPayment } from "@/types/payment.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const paymentService = {
  /** GET /payments — List payments (admin) */
  getAll: async function (
    token: string,
    query?: {
      page?: string;
      limit?: string;
      status?: string;
      method?: string;
      search?: string;
    },
  ): Promise<{
    data: IPayment[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.status) params.set("status", query.status);
      if (query?.method) params.set("method", query.method);
      if (query?.search) params.set("search", query.search);
      const url = `${API_URL}/payments${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IPayment[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching payments",
        },
      };
    }
  },

  /** GET /payments/:id */
  getById: async function (
    token: string,
    id: string,
  ): Promise<{ data: IPayment | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/payments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IPayment> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching payment",
        },
      };
    }
  },

  /** GET /payments/order/:orderId */
  getByOrderId: async function (
    token: string,
    orderId: string,
  ): Promise<{ data: IPayment | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/payments/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IPayment> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching payment",
        },
      };
    }
  },

  /** PATCH /payments/:id — Update payment status (admin) */
  update: async function (
    token: string,
    id: string,
    payload: { status: string; method?: string; reference?: string },
  ): Promise<{ data: IPayment | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/payments/${id}`, {
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
      const response: ApiResponse<IPayment> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating payment",
        },
      };
    }
  },
};
