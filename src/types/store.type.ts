export interface IStore {
  id: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  address?: string | null;
  businessHours?: IBusinessHour[];
  _count?: { orders: number; userRoles: number };
}

export interface IBusinessHour {
  id: string;
  storeId: string;
  dayOfWeek: number;
  openTime?: string | null;
  closeTime?: string | null;
  isClosed: boolean;
}

export interface IStoreCreatePayload {
  slug: string;
  isActive?: boolean;
  name: string;
  address?: string;
  businessHours?: {
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed?: boolean;
  }[];
}

export interface IStoreUpdatePayload {
  slug?: string;
  isActive?: boolean;
  name?: string;
  address?: string;
  businessHours?: {
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed?: boolean;
  }[];
}

export interface IStoreFormValues {
  name: string;
  slug: string;
  address?: string;
  isActive?: boolean;
  businessHours?: {
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed?: boolean;
  }[];
}
