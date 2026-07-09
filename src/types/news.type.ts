export interface INews {
  id: string;
  publishedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  translations?: INewsTranslation[];
}

export interface INewsTranslation {
  id: string;
  newsId: string;
  locale: "EN" | "BN";
  title?: string | null;
  body?: string | null;
}

export interface INewsCreatePayload {
  publishedAt?: string;
  isActive?: boolean;
  translations: { locale: "EN" | "BN"; title: string; body?: string }[];
}

export interface INewsUpdatePayload {
  publishedAt?: string;
  isActive?: boolean;
  translations?: { locale: "EN" | "BN"; title: string; body?: string }[];
}
