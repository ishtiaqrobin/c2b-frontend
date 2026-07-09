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
  translations?: ICategoryTranslation[];
  children?: ICategory[];
  parent?: ICategory | null;
  notice?: ICategoryNotice | null;
}

export interface ICategoryTranslation {
  id: string;
  categoryId: string;
  locale: "EN" | "BN";
  name: string;
}

export interface ICategoryCreatePayload {
  slug: string;
  parentId?: string | null;
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  translations: { locale: "EN" | "BN"; name: string }[];
}

export interface ICategoryUpdatePayload {
  slug?: string;
  parentId?: string | null;
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  translations?: { locale: "EN" | "BN"; name: string }[];
}

export interface ICategoryNotice {
  id: string;
  categoryId: string;
  updatedAt: string;
  translations?: ICategoryNoticeTranslation[];
}

export interface ICategoryNoticeTranslation {
  id: string;
  noticeId: string;
  locale: "EN" | "BN";
  body: string;
}

export interface INoticeCreatePayload {
  categoryId: string;
  translations: { locale: "EN" | "BN"; body: string }[];
}

export interface INoticeUpdatePayload {
  translations: { locale: "EN" | "BN"; body: string }[];
}
