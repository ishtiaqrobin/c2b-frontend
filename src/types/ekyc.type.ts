export interface IEkyc {
  id: string;
  userId: string;
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "VERIFIED"
    | "REJECTED"
    | "RESUBMITTED"
    | "REJECTED_FINAL";
  rejectReason?: string | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  documents?: IEkycDocument[];
  user?: IUser;
}

export interface IEkycDocument {
  id: string;
  ekycId: string;
  docType: string;
  fileUrl: string;
  publicId?: string | null;
  createdAt: string;
}

export interface IEkycUpdatePayload {
  status: "VERIFIED" | "REJECTED";
  rejectReason?: string;
}

export interface IEkycDocumentUploadPayload {
  docType: string;
}
