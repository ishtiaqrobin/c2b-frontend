export interface ICategory {
  id: string;
  slug: string;
  parentId?: string | null;
  isPopular: boolean;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  children?: ICategory[];
  parent?: ICategory | null;
  notice?: ICategoryNotice | null;
}

export interface ICategoryCreatePayload {
  slug: string;
  parentId?: string | null;
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  name: string;
}

export interface ICategoryUpdatePayload {
  slug?: string;
  parentId?: string | null;
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

export interface INoticeCreatePayload {
  categoryId: string;
  body: string;
}

export interface INoticeUpdatePayload {
  body: string;
}
