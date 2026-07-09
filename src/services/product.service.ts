import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  IProduct,
  IProductVariant,
  IPriceHistory,
} from "@/types/product.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const productService = {
  /** GET /products — List products */
  getAll: async function (query?: {
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    isActive?: string;
    locale?: string;
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
      if (query?.locale) params.set("locale", query.locale);
      const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IProduct[]> = await res.json();
      return { data: response.data, meta: response.meta ?? null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching products",
        },
      };
    }
  },

  /** GET /products/:id — Get product by ID */
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
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching product",
        },
      };
    }
  },

  /** GET /products/slug/:slug — Get by slug */
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
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching product",
        },
      };
    }
  },

  /** POST /products — Create product */
  create: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IProduct | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products`, {
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
      const response: ApiResponse<IProduct> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error creating product",
        },
      };
    }
  },

  /** PATCH /products/:id — Update product */
  update: async function (
    token: string,
    id: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IProduct | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
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
      const response: ApiResponse<IProduct> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating product",
        },
      };
    }
  },

  /** DELETE /products/:id — Soft delete */
  delete: async function (
    token: string,
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
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
            err instanceof Error ? err.message : "Error deleting product",
        },
      };
    }
  },

  // ====== Variants ======

  /** GET /products/variants — List variants */
  getVariants: async function (query?: {
    page?: string;
    limit?: string;
    productId?: string;
    storage?: string;
  }): Promise<{ data: IProductVariant[] | null; error: ServiceError | null }> {
    try {
      const params = new URLSearchParams();
      if (query?.page) params.set("page", query.page);
      if (query?.limit) params.set("limit", query.limit);
      if (query?.productId) params.set("productId", query.productId);
      if (query?.storage) params.set("storage", query.storage);
      const url = `${API_URL}/products/variants${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<IProductVariant[]> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching variants",
        },
      };
    }
  },

  /** POST /products/:productId/variants — Create variant */
  createVariant: async function (
    token: string,
    productId: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IProductVariant | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products/${productId}/variants`, {
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
      const response: ApiResponse<IProductVariant> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error creating variant",
        },
      };
    }
  },

  /** PATCH /products/variants/:id — Update variant */
  updateVariant: async function (
    token: string,
    id: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: IProductVariant | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products/variants/${id}`, {
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
      const response: ApiResponse<IProductVariant> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating variant",
        },
      };
    }
  },

  /** DELETE /products/variants/:id — Delete variant */
  deleteVariant: async function (
    token: string,
    id: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/products/variants/${id}`, {
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
            err instanceof Error ? err.message : "Error deleting variant",
        },
      };
    }
  },

  /** PATCH /products/variants/:variantId/price — Update price */
  updatePrice: async function (
    token: string,
    variantId: string,
    payload: { condition: string; newPrice: number },
  ): Promise<{ data: IProductVariant | null; error: ServiceError | null }> {
    try {
      const res = await fetch(
        `${API_URL}/products/variants/${variantId}/price`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
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
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error updating price",
        },
      };
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
        error: {
          message:
            err instanceof Error ? err.message : "Error fetching price history",
        },
      };
    }
  },
};
