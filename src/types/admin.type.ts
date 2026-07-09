import type { IUser } from "./user.type";

export interface IAdminProfile {
  id: string;
  userId: string;
  displayName?: string | null;
  isActive: boolean;
  user?: IUser;
}

export interface IAuditLog {
  id: string;
  adminId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  description?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
  admin?: IAdminProfile | null;
}

export interface IAdminTask {
  id: string;
  adminId?: string | null;
  orderId?: string | null;
  storeId?: string | null;
  title?: string | null;
  description?: string | null;
  isDone: boolean;
  dueAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPromoteStaffPayload {
  userId: string;
  displayName?: string;
  roleId?: string;
  storeId?: string | null;
}

export interface IAssignRolePayload {
  roleId: string;
  storeId?: string | null;
}

export interface IListUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  userType?: "CUSTOMER" | "STAFF";
  isDeleted?: boolean;
}

export interface IReviewEkycPayload {
  status: "VERIFIED" | "REJECTED";
  rejectReason?: string;
}

export interface IAdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalStaff: number;
  totalMerchants: number;
  totalOrders: number;
  totalPendingOrders: number;
  totalCompletedOrders: number;
  totalCancelledOrders: number;
  totalPayments: number;
  totalPaidAmount: number;
  totalPendingPayments: number;
  totalProducts: number;
  totalCategories: number;
  totalStores: number;
  totalBanners: number;
  totalNews: number;
  totalEkycPending: number;
  totalEkycVerified: number;
  totalEkycRejected: number;
}
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
  };
  tutor: {
    id: string;
    hourlyRate: number;
    user: {
      name: string;
      email: string;
      image: string | null;
    };
  };
}
