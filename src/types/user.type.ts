export interface ISession {
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  userType: "CUSTOMER" | "MERCHANT" | "STAFF";
  accountType?: string | null;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  isSuperOwner: boolean;
  isActive: boolean;
  isBanned: boolean;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Extended profile (from getMe)
  ekyc?: { status: string } | null;
  individualProfile?: IIndividualProfile | null;
  corporationProfile?: ICorporationProfile | null;
  roles?: IUserRoleSimplified[];
}

export interface IIndividualProfile {
  id: string;
  userId: string;
  qualifiedInvoiceStatus: string;
  fullName: string;
  telephone: string;
  dateOfBirth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  occupation?: string | null;
  postCode: string;
  prefectureId: number;
  cityTownVillage: string;
  streetAddress: string;
  apartment?: string | null;
  prefecture?: IPrefecture;
}

export interface ICorporationProfile {
  id: string;
  userId: string;
  qualifiedInvoiceStatus: string;
  companyName: string;
  companyTelephone: string;
  companyPostCode: string;
  companyPrefectureId: number;
  companyCityTownVillage: string;
  companyStreetAddress: string;
  companyApartment?: string | null;
  contactName: string;
  contactTelephone: string;
  contactDateOfBirth: string;
  contactSex: "MALE" | "FEMALE" | "OTHER";
  contactOccupation?: string | null;
  contactPostCode: string;
  contactPrefectureId: number;
  contactCityTownVillage: string;
  contactStreetAddress: string;
  contactApartment?: string | null;
  bankAccount: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface IPrefecture {
  id: number;
  code: string;
  nameEn: string;
  nameBn: string;
}

export interface IUserRole {
  id: string;
  userId: string;
  roleId: string;
  storeId?: string | null;
  role: IRole;
}

export interface IRole {
  id: string;
  key: string;
  name?: string | null;
  description?: string | null;
  level: number;
  isSystem: boolean;
  isActive: boolean;
  permissions?: IPermission[];
}

export interface IPermission {
  id: string;
  key: string;
  group: string;
  description?: string | null;
}

/** Simplified role structure returned by auth/getMe endpoint */
export interface IUserRoleSimplified {
  storeId?: string | null;
  role: {
    key: string;
    name?: string | null;
  };
}

export interface IChangedPasswordPayload {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}
