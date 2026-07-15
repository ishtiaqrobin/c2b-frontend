import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type {
  IProduct,
  IProductFormValues,
  IProductCreatePayload,
  IProductVariant,
  IVariantDeduction,
  IVariantCreatePayload,
  IVariantUpdatePayload,
  IDeductionCreatePayload,
  IDeductionUpdatePayload,
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
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
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

  /**
   * Builds the multipart FormData the backend's multer middleware expects.
   *
   * IMPORTANT: fields are appended flat (slug, categoryId, name, ...) —
   * NOT nested under a single "data" JSON string. The backend's
   * createProduct/updateProduct controllers read `req.body` directly
   * (multer parses text fields onto req.body as flat key/value pairs)
   * and createProductZodSchema/updateProductZodSchema validate those
   * same flat top-level fields. A nested `data` field would fail
   * validation silently mismatched (zod would see none of the expected
   * keys at the top level).
   *
   * `variants` is intentionally NOT sent through this form — nested
   * arrays (with their own nested `deductions` arrays) don't serialize
   * cleanly as multipart fields, and the backend does not JSON-parse a
   * stringified `variants` field. To create a product with variants,
   * either:
   *   1. Create the product here first (no variants), then add each
   *      variant via `productService.createVariant()`, or
   *   2. Use a plain JSON POST (no image) that includes `variants`
   *      directly, then attach the product image afterward via
   *      `update()`.
   */
  buildProductFormData: (values: IProductFormValues): FormData => {
    const formData = new FormData();
    if (values.image) formData.append("image", values.image);
    const data: Record<string, unknown> = {};
    if (values.name !== undefined) data.name = values.name;
    if (values.slug !== undefined) data.slug = values.slug;
    if (values.categoryId !== undefined) data.categoryId = values.categoryId;
    if (values.isActive !== undefined) data.isActive = values.isActive;
    formData.append("data", JSON.stringify(data));
    return formData;
  },

  /**
   * POST /products with a plain JSON body — use this instead of
   * `create()` + `buildProductFormData` when you need to send `variants`
   * (with nested `deductions`) in the same call. No image upload in
   * this path; attach an image afterward via `update()` if needed.
   */
  createWithVariants: async function (
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

  /** POST /products — Create product */
  create: async function (
    formData: FormData,
  ): Promise<ServiceResult<IProduct>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/products`, {
        method: "POST",
        body: formData,
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
    formData: FormData,
  ): Promise<ServiceResult<IProduct>> {
    try {
      const res = await fetchWithCookies(`${API_URL}/products/${id}`, {
        method: "PATCH",
        body: formData,
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

  /**
   * GET /products/variants — List variants.
   * Pass `categoryId` (no `productId`) to browse every variant across
   * every product under a category in one call — this is what the
   * storefront category/homepage grid uses.
   */
  getVariants: async function (query?: {
    page?: string;
    limit?: string;
    productId?: string;
    categoryId?: string;
    categoryIds?: string;
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
      if (query?.categoryId) params.set("categoryId", query.categoryId);
      if (query?.categoryIds) params.set("categoryIds", query.categoryIds);
      if (query?.storage) params.set("storage", query.storage);
      if (query?.isActive) params.set("isActive", query.isActive);
      const url = `${API_URL}/products/variants${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
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
      const res = await fetchWithCookies(`${API_URL}/products/variants/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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
      const res = await fetchWithCookies(`${API_URL}/products/variants/${id}`, {
        method: "DELETE",
      });
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

  // ==================== DEDUCTION (ADMIN) ====================

  /** POST /products/variants/:variantId/deductions */
  createDeduction: async function (
    variantId: string,
    payload: IDeductionCreatePayload,
  ): Promise<ServiceResult<IVariantDeduction>> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/products/variants/${variantId}/deductions`,
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
      const response: ApiResponse<IVariantDeduction> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error creating deduction") };
    }
  },

  /** PATCH /products/deductions/:deductionId */
  updateDeduction: async function (
    deductionId: string,
    payload: IDeductionUpdatePayload,
  ): Promise<ServiceResult<IVariantDeduction>> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/products/deductions/${deductionId}`,
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
      const response: ApiResponse<IVariantDeduction> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error updating deduction") };
    }
  },

  /** DELETE /products/deductions/:deductionId */
  deleteDeduction: async function (
    deductionId: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetchWithCookies(
        `${API_URL}/products/deductions/${deductionId}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: errorFrom(err, "Error deleting deduction") };
    }
  },
};
