import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IOrder } from "@/types/order.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const orderService = {
  /** GET /orders — List orders (customer sees own, super_admin sees all) */
  getAll: async function (
    token: string,
    query?: {
      page?: string;
      limit?: string;
      status?: string;
      storeId?: string;
      method?: string;
      search?: string;
    },
  ): Promise<{
    data: IOrder[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.status) params.set("status", query.status);
      if (query?.storeId) params.set("storeId", query.storeId);
      if (query?.method) params.set("method", query.method);
      if (query?.search) params.set("search", query.search);
      const url = `${API_URL}/orders${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IOrder[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error fetching orders",
        },
      };
    }
  },

  /** GET /orders/:id */
  getById: async function (
    token: string,
    id: string,
  ): Promise<{ data: IOrder | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IOrder> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error fetching order",
        },
      };
    }
  },

  /** GET /orders/number/:orderNumber */
  getByOrderNumber: async function (
    token: string,
    orderNumber: string,
  ): Promise<{ data: IOrder | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/orders/number/${orderNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IOrder> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error fetching order",
        },
      };
    }
  },

  /** POST /orders — Create order */
  create: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IOrder | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/orders`, {
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
      const response: ApiResponse<IOrder> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error creating order",
        },
      };
    }
  },

  /** PATCH /orders/:id/cancel — Cancel order (customer) */
  cancel: async function (
    token: string,
    id: string,
  ): Promise<{ data: IOrder | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IOrder> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error cancelling order",
        },
      };
    }
  },

  /** PATCH /orders/:id/status — Update status (admin/staff) */
  updateStatus: async function (
    token: string,
    id: string,
    payload: { status: string; note?: string },
  ): Promise<{ data: IOrder | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
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
      const response: ApiResponse<IOrder> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating order status",
        },
      };
    }
  },

  /** PATCH /orders/:id/tracking — Update tracking number (admin/staff) */
  updateTracking: async function (
    token: string,
    id: string,
    payload: { trackingNumber: string },
  ): Promise<{ data: IOrder | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/tracking`, {
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
      const response: ApiResponse<IOrder> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating tracking",
        },
      };
    }
  },
};
