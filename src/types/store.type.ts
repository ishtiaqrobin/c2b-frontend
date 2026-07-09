export interface IStore {
  id: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  translations?: IStoreTranslation[];
  businessHours?: IBusinessHour[];
}

export interface IStoreTranslation {
  id: string;
  storeId: string;
  locale: "EN" | "BN";
  name: string;
  address?: string | null;
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
  translations: { locale: "EN" | "BN"; name: string; address?: string }[];
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
  translations?: { locale: "EN" | "BN"; name: string; address?: string }[];
  businessHours?: {
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed?: boolean;
  }[];
}
