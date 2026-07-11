import { ICategory } from "./category.type";

export interface IBanner {
  id: string;
  categoryId?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Pick<ICategory, "id" | "slug"> | null;
}

export interface IBannerListQuery {
  page?: string;
  limit?: string;
  categoryId?: string;
  isActive?: string;
}

/**
 * Shape used by the create/edit form. `image` is required when creating
 * a new banner and optional when editing (keep the existing image).
 * Enforce that at the form/validation layer, not here.
 */
export interface IBannerFormValues {
  image?: File;
  categoryId?: string | null;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}
