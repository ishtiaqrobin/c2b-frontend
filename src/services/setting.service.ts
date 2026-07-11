import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { ISettings } from "@/types/settings.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const settingService = {
  /** GET /settings — Get site settings (public) */
  getSettings: async function (): Promise<{
    data: ISettings | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetch(`${API_URL}/settings`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ISettings> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching settings",
        },
      };
    }
  },

  /** PATCH /settings — Update site settings (admin) */
  updateSettings: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: ISettings | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ISettings> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating settings",
        },
      };
    }
  },
};
