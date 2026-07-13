import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  IProduct,
  IProductCreatePayload,
  IProductUpdatePayload,
  IProductVariant,
  IVariantCreatePayload,
  IVariantUpdatePayload,
  IPriceHistory,
  IPriceUpdatePayload,
} from "@/types/product.type";

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

export const productService = {
  // ==================== PRODUCT (PUBLIC) ====================

  /** GET /products — List products */
  getAll: async function (query?: {
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    isActive?: string;
  }): Promise<{
    data: IProduct[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.search) params.set("search", query.search);
      if (query?.categoryId) params.set("categoryId", query.categoryId);
      if (query?.isActive) params.set("isActive", query.isActive);
      const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, { credentials: "include", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IProduct[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching products") };
    }
  },

  /** GET /products/:id */
  getById: async function (
    id: string,
  ): Promise<{ data: IProduct | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IProduct> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching product") };
    }
  },

  /** GET /products/slug/:slug */
  getBySlug: async function (
    slug: string,
  ): Promise<{ data: IProduct | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products/slug/${slug}`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IProduct> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching product") };
    }
  },

  // ==================== PRODUCT (ADMIN) ====================

  /** POST /products — Create product */
  create: async function (
    payload: IProductCreatePayload,
  ): Promise<ServiceResult<IProduct>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IProduct> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error creating product") };
    }
  },

  /** PATCH /products/:id — Update product */
  update: async function (
    id: string,
    payload: IProductUpdatePayload,
  ): Promise<ServiceResult<IProduct>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IProduct> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating product") };
    }
  },

  /** DELETE /products/:id — Soft delete */
  delete: async function (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error deleting product") };
    }
  },

  // ==================== VARIANT (PUBLIC) ====================

  /** GET /products/variants — List variants */
  getVariants: async function (query?: {
    page?: string;
    limit?: string;
    productId?: string;
    storage?: string;
    isActive?: string;
  }): Promise<{
    data: IProductVariant[] | null;
    meta?: { page: number; limit: number; total: number } | null;
    error: ServiceError | null;
  }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.productId) params.set("productId", query.productId);
      if (query?.storage) params.set("storage", query.storage);
      if (query?.isActive) params.set("isActive", query.isActive);
      const url = `${API_URL}/products/variants${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, { credentials: "include", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IProductVariant[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error fetching variants") };
    }
  },

  // ==================== VARIANT (ADMIN) ====================

  /** POST /products/:productId/variants */
  createVariant: async function (
    productId: string,
    payload: IVariantCreatePayload,
  ): Promise<ServiceResult<IProductVariant>> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/products/${productId}/variants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IProductVariant> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error creating variant") };
    }
  },

  /** PATCH /products/variants/:id */
  updateVariant: async function (
    id: string,
    payload: IVariantUpdatePayload,
  ): Promise<ServiceResult<IProductVariant>> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/products/variants/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IProductVariant> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating variant") };
    }
  },

  /** DELETE /products/variants/:id */
  deleteVariant: async function (
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/products/variants/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error deleting variant") };
    }
  },

  /** PATCH /products/variants/:variantId/price */
  updatePrice: async function (
    variantId: string,
    payload: IPriceUpdatePayload,
  ): Promise<ServiceResult<IPriceHistory>> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/products/variants/${variantId}/price`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<IPriceHistory> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating price") };
    }
  },

  /** GET /products/variants/:variantId/price-history */
  getPriceHistory: async function (
    variantId: string,
  ): Promise<{ data: IPriceHistory[] | null; error: ServiceError | null }> {
    try {
      const res = await fetch(
        `${API_URL}/products/variants/${variantId}/price-history`,
        { credentials: "include", cache: "no-store" },
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IPriceHistory[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: errorFrom(err, "Error fetching price history"),
      };
    }
  },
};
