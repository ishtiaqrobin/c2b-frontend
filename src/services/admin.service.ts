import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IAdminStats } from "@/types/admin.type";
import type { IUser, IUserRole } from "@/types/user.type";
import type { IAuditLog } from "@/types/admin.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const adminService = {
  /** GET /admins/stats */
  getStats: async function (
    token: string,
  ): Promise<{ data: IAdminStats | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/admins/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IAdminStats> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error fetching stats" } };
    }
  },

  /** POST /admins/staff — Promote user to staff */
  promoteToStaff: async function (
    token: string,
    payload: { userId: string; displayName?: string; roleId?: string; storeId?: string | null },
  ): Promise<{ data: IUser | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/admins/staff`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IUser> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error promoting to staff" } };
    }
  },

  /** POST /admins/users/:userId/roles — Assign role */
  assignRole: async function (
    token: string,
    userId: string,
    payload: { roleId: string; storeId?: string | null },
  ): Promise<{ data: IUserRole | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/admins/users/${userId}/roles`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IUserRole> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error assigning role" } };
    }
  },

  /** DELETE /admins/roles/:userRoleId — Revoke role */
  revokeRole: async function (
    token: string,
    userRoleId: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/admins/roles/${userRoleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error revoking role" } };
    }
  },

  /** GET /admins/users — List users */
  getUsers: async function (
    token: string,
    query?: { page?: number; limit?: number; search?: string; userType?: string; isDeleted?: boolean },
  ): Promise<{ data: IUser[] | null; meta?: { page: number; limit: number; total: number } | null; error: ServiceError | null }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", String(query.page));
      if (query?.limit) params.set("limit", String(query.limit));
      if (query?.search) params.set("search", query.search);
      if (query?.userType) params.set("userType", query.userType);
      if (query?.isDeleted !== undefined) params.set("isDeleted", String(query.isDeleted));

      const url = `${API_URL}/admins/users${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IUser[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error fetching users" } };
    }
  },

  /** PATCH /admins/users/:userId/soft-delete — Soft delete user */
  softDeleteUser: async function (
    token: string,
    userId: string,
  ): Promise<{ data: IUser | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/admins/users/${userId}/soft-delete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IUser> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error deleting user" } };
    }
  },

  /** PATCH /admins/users/:userId/restore — Restore user */
  restoreUser: async function (
    token: string,
    userId: string,
  ): Promise<{ data: IUser | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/admins/users/${userId}/restore`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IUser> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error restoring user" } };
    }
  },

  /** GET /admins/audit-logs — Get audit logs */
  getAuditLogs: async function (
    token: string,
    query?: { page?: number; limit?: number },
  ): Promise<{ data: IAuditLog[] | null; meta?: { page: number; limit: number; total: number } | null; error: ServiceError | null }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", String(query.page));
      if (query?.limit) params.set("limit", String(query.limit));
      const url = `${API_URL}/admins/audit-logs${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IAuditLog[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error fetching audit logs" } };
    }
  },
};