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
  category?: ICategory;
  translations?: IProductTranslation[];
  variants?: IProductVariant[];
  _count?: { variants: number };
}

export interface IProductTranslation {
  id: string;
  productId: string;
  locale: "EN" | "BN";
  name: string;
}

export interface IProductVariant {
  id: string;
  productId: string;
  sku?: string | null;
  storage?: string | null;
  color?: string | null;
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
  product?: IProduct;
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
  translations?: IDeductionTranslation[];
}

export interface IDeductionTranslation {
  id: string;
  deductionId: string;
  locale: "EN" | "BN";
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

// ====== Create/Update Payloads ======

export interface IProductCreatePayload {
  slug: string;
  categoryId: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive?: boolean;
  translations: { locale: "EN" | "BN"; name: string }[];
  variants?: IVariantCreatePayload[];
}

export interface IProductUpdatePayload {
  slug?: string;
  categoryId?: string;
  imageUrl?: string;
  imagePublicId?: string;
  isActive?: boolean;
  translations?: { locale: "EN" | "BN"; name: string }[];
}

export interface IVariantCreatePayload {
  sku?: string;
  storage?: string;
  color?: string;
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
  translations: { locale: "EN" | "BN"; label: string }[];
}

export interface IDeductionUpdatePayload {
  condition?: "NEW" | "USED";
  amount?: number;
  sortOrder?: number;
  isActive?: boolean;
  translations?: { locale: "EN" | "BN"; label: string }[];
}

export interface IPriceUpdatePayload {
  condition: "NEW" | "USED";
  newPrice: number;
}
