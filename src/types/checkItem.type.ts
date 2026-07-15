export interface ICategoryCheckItem {
  id: string;
  categoryId: string;
  content: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; slug: string; name: string } | null;
}

export interface ICheckItemQuery {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string;
  isActive?: string;
}

export interface ICheckItemFormValues {
  categoryId: string;
  content: string;
  sortOrder?: number;
}

export interface ICheckItemCreatePayload {
  categoryId: string;
  content: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ICheckItemUpdatePayload {
  content?: string;
  sortOrder?: number;
  isActive?: boolean;
}
