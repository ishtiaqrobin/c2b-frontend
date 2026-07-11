export type AddressType = "HOME" | "SHIPPING" | "RETURN" | "COMPANY";

export interface IAddress {
  id: string;
  userId: string;
  type: AddressType;
  label?: string | null;
  recipientName?: string | null;
  telephone?: string | null;
  postCode: string;
  districtId: number;
  cityTownVillage: string;
  streetAddress: string;
  apartment?: string | null;
  isDefault: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  district?: IDistrict;
}

export interface IDistrict {
  id: number;
  code: string;
  nameEn: string;
  nameBn: string;
  divisionId?: number;
}

export interface IDivision {
  id: number;
  code: string;
  nameEn: string;
  nameBn: string;
}

export interface IAddressCreatePayload {
  type?: AddressType;
  label?: string;
  recipientName?: string;
  telephone?: string;
  postCode: string;
  districtId: number;
  cityTownVillage: string;
  streetAddress: string;
  apartment?: string;
  isDefault?: boolean;
}

export interface IAddressUpdatePayload {
  type?: AddressType;
  label?: string;
  recipientName?: string;
  telephone?: string;
  postCode?: string;
  districtId?: number;
  cityTownVillage?: string;
  streetAddress?: string;
  apartment?: string;
  isDefault?: boolean;
}
