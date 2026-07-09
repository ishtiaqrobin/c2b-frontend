import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { INotification } from "@/types/notification.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const notificationService = {
  /** GET /notifications/my — My notifications */
  getMyNotifications: async function (
    token: string,
    query?: { page?: string; limit?: string },
  ): Promise<{
    data: INotification[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      const url = `${API_URL}/notifications/my${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<INotification[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching notifications",
        },
      };
    }
  },

  /** GET /notifications/my/unread-count */
  getUnreadCount: async function (
    token: string,
  ): Promise<{ data: { count: number } | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/notifications/my/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<{ count: number }> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching unread count",
        },
      };
    }
  },

  /** PATCH /notifications/my/:id/read — Mark as read */
  markAsRead: async function (
    token: string,
    id: string,
  ): Promise<{ data: INotification | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/notifications/my/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<INotification> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error marking as read",
        },
      };
    }
  },

  /** PATCH /notifications/my/read-all — Mark all as read */
  markAllAsRead: async function (
    token: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/notifications/my/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return { data: null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error marking all as read",
        },
      };
    }
  },

  /** POST /notifications — Create (admin) */
  create: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: INotification | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
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
      const response: ApiResponse<INotification> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error creating notification",
        },
      };
    }
  },

  /** DELETE /notifications/:id — Delete (admin) */
  delete: async function (
    token: string,
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}`, {
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
          message:
            err instanceof Error ? err.message : "Error deleting notification",
        },
      };
    }
  },
};
