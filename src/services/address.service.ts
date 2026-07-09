import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { IAddress, IPrefecture } from "@/types/address.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const addressService = {
  /** GET /addresses/my — My addresses */
  getMyAddresses: async function (
    token: string,
  ): Promise<{ data: IAddress[] | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/addresses/my`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IAddress[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching addresses",
        },
      };
    }
  },

  /** POST /addresses/my — Create address */
  create: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IAddress | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/addresses/my`, {
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
      const response: ApiResponse<IAddress> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error creating address",
        },
      };
    }
  },

  /** PATCH /addresses/my/:id — Update address */
  update: async function (
    token: string,
    id: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IAddress | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/addresses/my/${id}`, {
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
      const response: ApiResponse<IAddress> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating address",
        },
      };
    }
  },

  /** DELETE /addresses/my/:id — Soft delete */
  delete: async function (
    token: string,
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/addresses/my/${id}`, {
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
            err instanceof Error ? err.message : "Error deleting address",
        },
      };
    }
  },

  /** PATCH /addresses/my/:id/default — Set default */
  setDefault: async function (
    token: string,
    id: string,
  ): Promise<{ data: IAddress | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/addresses/my/${id}/default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IAddress> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error
              ? err.message
              : "Error setting default address",
        },
      };
    }
  },

  /** GET /addresses/prefectures — List prefectures */
  getPrefectures: async function (): Promise<{
    data: IPrefecture[] | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetch(`${API_URL}/addresses/prefectures`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IPrefecture[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching prefectures",
        },
      };
    }
  },
};
