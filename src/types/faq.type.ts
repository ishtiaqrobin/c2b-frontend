export interface IFaq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IFaqListQuery {
  page?: string;
  limit?: string;
  isActive?: string;
}

export interface IFaqFormValues {
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
}
