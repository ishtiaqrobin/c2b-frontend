import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  IAddress,
  IAddressCreatePayload,
  IAddressUpdatePayload,
  IDistrict,
  IDivision,
} from "@/types/address.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: ServiceError };

const errorFrom = (err: unknown, fallback: string): ServiceError => ({
  message: err instanceof Error ? err.message : fallback,
});

async function fetchWithCookies(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    credentials: "include",
  });
}

export const addressService = {
  /** GET /addresses/my — Get current user's addresses (auth required) */
  getMyAddresses: async function (): Promise<{
    data: IAddress[] | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetchWithCookies(`${API_URL}/addresses/my`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IAddress[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching addresses") };
    }
  },

  /** POST /addresses/my — Create address (auth required) */
  create: async function (
    payload: IAddressCreatePayload,
  ): Promise<ServiceResult<IAddress>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/addresses/my`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IAddress> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error creating address") };
    }
  },

  /** PATCH /addresses/my/:id — Update address (auth required) */
  update: async function (
    id: string,
    payload: IAddressUpdatePayload,
  ): Promise<ServiceResult<IAddress>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/addresses/my/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IAddress> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating address") };
    }
  },

  /** DELETE /addresses/my/:id — Soft delete (auth required) */
  delete: async function (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(`${API_URL}/addresses/my/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error deleting address") };
    }
  },

  /** PATCH /addresses/my/:id/default — Set as default (auth required) */
  setDefault: async function (
    id: string,
  ): Promise<ServiceResult<IAddress>> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/addresses/my/${id}/default`,
        { method: "PATCH" },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IAddress> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error setting default address"),
      };
    }
  },

  /** GET /addresses/divisions — List divisions (public) */
  getDivisions: async function (): Promise<{
    data: IDivision[] | null;
    error: ServiceError | null;
  }> {
    try {
      const res = await fetch(`${API_URL}/addresses/divisions`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IDivision[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching divisions") };
    }
  },

  /** GET /addresses/districts — List all districts (public) */
  getDistricts: async function (query?: {
    search?: string;
    limit?: string;
  }): Promise<{ data: IDistrict[] | null; error: ServiceError | null }> {
    try {
      const params = new URLSearchParams();
      if (query?.search) params.set("search", query.search);
      params.set("limit", query?.limit ?? "100");
      const res = await fetch(
        `${API_URL}/addresses/districts?${params.toString()}`,
        { credentials: "include", cache: "no-store" },
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IDistrict[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching districts") };
    }
  },

  /** GET /addresses/divisions/:divisionId/districts — Districts by division (public) */
  getDistrictsByDivision: async function (
    divisionId: number,
  ): Promise<{ data: IDistrict[] | null; error: ServiceError | null }> {
    try {
      const res = await fetch(
        `${API_URL}/addresses/divisions/${divisionId}/districts`,
        { credentials: "include", cache: "no-store" },
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IDistrict[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching districts") };
    }
  },
};
