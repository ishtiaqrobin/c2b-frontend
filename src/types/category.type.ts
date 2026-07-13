export interface ICategoryParentRef {
  id: string;
  slug: string;
  name: string;
}

export interface ICategoryCount {
  children: number;
  products: number;
}

export interface ICategory {
  id: string;
  slug: string;
  parentId?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  children?: ICategory[];
  // Backend only includes { id, slug, name } for `parent`, not the
  // full category object — this now matches category.service.ts's
  // `categoryInclude` shape exactly.
  parent?: ICategoryParentRef | null;
  // Present on list/detail responses (createCategory, getCategoryById,
  // getCategoryBySlug, listCategories, updateCategory). Used by the
  // dashboard to know whether a category can be safely deleted/moved
  // (e.g. block delete or re-parenting when children/products > 0).
  _count?: ICategoryCount;
  notice?: ICategoryNotice | null;
}

export interface ICategoryCreatePayload {
  slug: string;
  parentId?: string | null;
  imageUrl?: string;
  imagePublicId?: string | null;
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  name: string;
}

export interface ICategoryUpdatePayload {
  slug?: string;
  parentId?: string | null;
  imageUrl?: string;
  imagePublicId?: string | null;
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  name?: string;
}

export interface ICategoryNotice {
  id: string;
  categoryId: string;
  updatedAt: string;
  body: string;
}

export interface ICategoryFormValues {
  image?: File;
  slug: string;
  name: string;
  parentId?: string | null;
  sortOrder?: number;
  isPopular?: boolean;
  isActive?: boolean;
}

export interface INoticeCreatePayload {
  categoryId: string;
  body: string;
}

export interface INoticeUpdatePayload {
  body: string;
}
