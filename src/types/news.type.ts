export interface INews {
  id: string;
  publishedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  title: string;
  body?: string | null;
}

export interface INewsCreatePayload {
  publishedAt?: string;
  isActive?: boolean;
  title: string;
  body?: string;
}

export interface INewsUpdatePayload {
  publishedAt?: string;
  isActive?: boolean;
  title?: string;
  body?: string;
}
