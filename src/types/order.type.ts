export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  method: "IN_STORE" | "MAIL_IN" | "CORPORATE";
  status: string;
  storeId?: string | null;
  handledBy?: string | null;
  courier?: string | null;
  trackingNumber?: string | null;
  shippingAddressId?: string | null;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
  store?: IStore;
  shippingAddress?: IAddress;
  items?: IOrderItem[];
  statusHistory?: IOrderStatusHistory[];
  payment?: IPayment;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  variantId: string;
  condition: string;
  quantity: number;
  notes?: string | null;
  basePriceSnapshot: number;
  totalDeduction: number;
  unitPriceSnapshot: number;
  lineTotal: number;
  productNameSnapshot: string;
  variant?: IProductVariant;
  deductions?: IOrderItemDeduction[];
}

export interface IOrderItemDeduction {
  id: string;
  orderItemId: string;
  deductionId: string;
  labelSnapshot: string;
  amountSnapshot: number;
}

export interface IOrderStatusHistory {
  id: string;
  orderId: string;
  status: string;
  note?: string | null;
  changedBy?: string | null;
  createdAt: string;
}

export interface IOrderCreatePayload {
  method: "IN_STORE" | "MAIL_IN" | "CORPORATE";
  storeId?: string;
  shippingAddressId?: string;
  courier?: string;
  items: {
    variantId: string;
    condition: string;
    quantity?: number;
    notes?: string;
    deductionIds?: string[];
  }[];
}

export interface IOrderStatusUpdatePayload {
  status: string;
  note?: string;
}

export interface IOrderTrackingUpdatePayload {
  trackingNumber: string;
}
