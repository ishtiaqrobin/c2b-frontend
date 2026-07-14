import type { ICategory } from "./category.type";

export type { ICategory };

export interface IProduct {
  id: string;
  slug: string;
  categoryId: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Backend's Product.updateDate — shown on the storefront as
  // "Update date 2026/07/14" next to the category breadcrumb.
  updateDate?: string;
  category?: ICategory;
  name: string;
  variants?: IProductVariant[];
  _count?: { variants: number };
}

/**
 * The narrower `product` shape actually returned when fetching
 * variants (listVariants / getVariantById) — a `select`, not the full
 * IProduct. Kept separate from IProduct so the storefront grid doesn't
 * assume fields (isActive, isDeleted, categoryId, ...) that aren't
 * present in this response.
 */
export interface IVariantProductRef {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  updateDate?: string;
  category?: ICategory | null;
}

export interface IProductVariant {
  id: string;
  productId: string;
  sku?: string | null;
  storage?: string | null;
  color?: string | null;
  // Color-specific photo. Falls back to the parent product's imageUrl
  // in the UI when this is null.
  imageUrl?: string | null;
  imagePublicId?: string | null;
  newPrice?: number | null;
  usedPrice?: number | null;
  currency: string;
  maxQuantityPerOrder?: number | null;
  dailyPurchaseLimit?: number | null;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  product?: IVariantProductRef;
  deductions?: IVariantDeduction[];
  priceHistory?: IPriceHistory[];
}

export interface IVariantDeduction {
  id: string;
  variantId: string;
  condition: "NEW" | "USED";
  amount: number;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  label: string;
}

export interface IPriceHistory {
  id: string;
  variantId: string;
  condition: "NEW" | "USED";
  oldPrice?: number | null;
  newPrice?: number | null;
  changedBy?: string | null;
  createdAt: string;
}

/**
 * Shape used by the product create/edit form.
 * `image` is required when creating a new product and optional when editing.
 *
 * NOTE: `variants` here is NOT sent by `productService.buildProductFormData`
 * (multipart form fields can't cleanly carry nested arrays). If a form
 * needs to submit variants at creation time, use
 * `productService.createWithVariants()` (plain JSON, no image) instead.
 */
export interface IProductFormValues {
  image?: File;
  name: string;
  slug: string;
  categoryId: string;
  isActive?: boolean;
  variants?: IVariantCreatePayload[];
}

// ====== Create/Update Payloads ======

export interface IProductCreatePayload {
  slug: string;
  categoryId: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive?: boolean;
  name: string;
  variants?: IVariantCreatePayload[];
}

export interface IProductUpdatePayload {
  slug?: string;
  categoryId?: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive?: boolean;
  name?: string;
}

export interface IVariantCreatePayload {
  sku?: string;
  storage?: string;
  color?: string;
  imageUrl?: string;
  imagePublicId?: string;
  newPrice?: number;
  usedPrice?: number;
  currency?: string;
  maxQuantityPerOrder?: number;
  dailyPurchaseLimit?: number;
  isActive?: boolean;
  deductions?: IDeductionCreatePayload[];
}

export interface IVariantUpdatePayload {
  sku?: string;
  storage?: string;
  color?: string;
  imageUrl?: string;
  imagePublicId?: string;
  newPrice?: number;
  usedPrice?: number;
  currency?: string;
  maxQuantityPerOrder?: number;
  dailyPurchaseLimit?: number;
  isActive?: boolean;
}

/**
 * Shape used by an admin variant-image form (multipart upload), mirroring
 * IProductFormValues. Not required for the storefront read-only grid, but
 * added for when the admin variant dialog is built.
 */
export interface IVariantFormValues {
  image?: File;
  sku?: string;
  storage?: string;
  color?: string;
  newPrice?: number;
  usedPrice?: number;
  currency?: string;
  maxQuantityPerOrder?: number;
  dailyPurchaseLimit?: number;
  isActive?: boolean;
}

export interface IDeductionCreatePayload {
  condition: "NEW" | "USED";
  amount: number;
  sortOrder?: number;
  isActive?: boolean;
  label: string;
}

export interface IDeductionUpdatePayload {
  condition?: "NEW" | "USED";
  amount?: number;
  sortOrder?: number;
  isActive?: boolean;
  label?: string;
}

export interface IPriceUpdatePayload {
  condition: "NEW" | "USED";
  newPrice: number;
}
