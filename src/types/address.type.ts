export interface IAddress {
  id: string;
  userId: string;
  type: "HOME" | "SHIPPING" | "RETURN" | "COMPANY";
  label?: string | null;
  recipientName?: string | null;
  telephone?: string | null;
  postCode: string;
  prefectureId: number;
  cityTownVillage: string;
  streetAddress: string;
  apartment?: string | null;
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  prefecture?: IPrefecture;
}

export interface IPrefecture {
  id: number;
  code: string;
  nameEn: string;
  nameBn: string;
}

export interface IAddressCreatePayload {
  type?: "HOME" | "SHIPPING" | "RETURN" | "COMPANY";
  label?: string;
  recipientName?: string;
  telephone?: string;
  postCode: string;
  prefectureId: number;
  cityTownVillage: string;
  streetAddress: string;
  apartment?: string;
  isDefault?: boolean;
}

export interface IAddressUpdatePayload {
  type?: "HOME" | "SHIPPING" | "RETURN" | "COMPANY";
  label?: string;
  recipientName?: string;
  telephone?: string;
  postCode?: string;
  prefectureId?: number;
  cityTownVillage?: string;
  streetAddress?: string;
  apartment?: string;
  isDefault?: boolean;
}
