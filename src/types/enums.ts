// ===== Core Enums matching backend =====

export enum Locale {
  EN = "EN",
  BN = "BN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export enum UserType {
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
  STAFF = "STAFF",
}

export enum AccountType {
  INDIVIDUAL = "INDIVIDUAL",
  CORPORATION = "CORPORATION",
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum AddressType {
  HOME = "HOME",
  SHIPPING = "SHIPPING",
  RETURN = "RETURN",
  COMPANY = "COMPANY",
}

export enum ItemCondition {
  NEW = "NEW",
  LIKE_NEW = "LIKE_NEW",
  USED = "USED",
  DAMAGED = "DAMAGED",
}

export enum BuybackMethod {
  IN_STORE = "IN_STORE",
  MAIL_IN = "MAIL_IN",
  CORPORATE = "CORPORATE",
}

export enum Courier {
  STEADFAST = "STEADFAST",
  PATHAO = "PATHAO",
  REDX = "REDX",
  PAPERFLY = "PAPERFLY",
  E_DESH = "E_DESH",
  SA_PARCEL = "SA_PARCEL",
  SUNDARBAN = "SUNDARBAN",
  ECURIER = "ECURIER",
  DLVRY = "DLVRY",
  STORE_PICKUP = "STORE_PICKUP",
  COMPANY_AGENT = "COMPANY_AGENT",
}

export enum EkycStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  RESUBMITTED = "RESUBMITTED",
  REJECTED_FINAL = "REJECTED_FINAL",
}

export enum EkycDocType {
  NID = "NID",
  SMART_CARD = "SMART_CARD",
  PASSPORT = "PASSPORT",
  DRIVING_LICENSE = "DRIVING_LICENSE",
  BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE",
  TIN_CERTIFICATE = "TIN_CERTIFICATE",
  TRADE_LICENSE = "TRADE_LICENSE",
  UTILITY_BILL = "UTILITY_BILL",
}

export enum OrderStatus {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  COURIER_ASSIGNED = "COURIER_ASSIGNED",
  PICK_ASSIGNED = "PICK_ASSIGNED",
  PICKED_UP = "PICKED_UP",
  RECEIVED = "RECEIVED",
  UNDER_INSPECTION = "UNDER_INSPECTION",
  PRICE_OFFERED = "PRICE_OFFERED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
  RETURN_SHIPPED = "RETURN_SHIPPED",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  BKASH = "BKASH",
  NAGAD = "NAGAD",
  ROCKET = "ROCKET",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
}

export enum NotificationChannel {
  EMAIL = "EMAIL",
  SMS = "SMS",
  IN_APP = "IN_APP",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  LISTED_FOR_RESALE = "LISTED_FOR_RESALE",
  SOLD = "SOLD",
  DISPOSED = "DISPOSED",
  IN_TRANSIT = "IN_TRANSIT",
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  COURIER_ASSIGNED: "Courier Assigned",
  PICK_ASSIGNED: "Pick Assigned",
  PICKED_UP: "Picked Up",
  RECEIVED: "Received",
  UNDER_INSPECTION: "Under Inspection",
  PRICE_OFFERED: "Price Offered",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PAYMENT_PENDING: "Payment Pending",
  PAID: "Paid",
  COMPLETED: "Completed",
  RETURN_SHIPPED: "Return Shipped",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};
