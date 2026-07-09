import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IUser } from "@/types/user.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const userService = {
  /** GET /users/me — Current authenticated user */
  getMe: async function (
    token: string,
  ): Promise<{ data: IUser | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IUser> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching profile",
        },
      };
    }
  },

  /** PUT /users/profile — Update profile (JSON or FormData) */
  updateProfile: async function (
    token: string,
    payload: Record<string, unknown> | FormData,
  ): Promise<{ data: IUser | null; error: ServiceError | null }> {
    try {
      const isFormData = payload instanceof FormData;
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (!isFormData) headers["Content-Type"] = "application/json";

      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers,
        credentials: "include",
        body: isFormData ? payload : JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`,
        );
      }
      const response: ApiResponse<IUser> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating profile",
        },
      };
    }
  },
};
