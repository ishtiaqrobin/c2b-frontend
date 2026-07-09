import { ICategory } from "./category.type";

export interface IBanner {
  id: string;
  categoryId?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  linkUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: ICategory;
}

export interface IBannerCreatePayload {
  categoryId?: string;
  imageUrl: string;
  imagePublicId?: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IBannerUpdatePayload {
  categoryId?: string;
  imageUrl?: string;
  imagePublicId?: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}
