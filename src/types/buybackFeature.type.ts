export interface IBuybackFeature {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBuybackFeatureQuery {
  page?: string;
  limit?: string;
}

export interface IBuybackFeatureFormValues {
  image?: File;
  title: string;
  description: string;
  sortOrder?: number;
}
