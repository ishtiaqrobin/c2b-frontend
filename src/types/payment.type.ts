export interface IPayment {
  id: string;
  orderId: string;
  storeId?: string | null;
  method: string;
  status: string;
  amount: number;
  currency: string;
  paidAt?: string | null;
  reference?: string | null;
  processedBy?: string | null;
  gatewayMeta?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  order?: IOrder;
  statusHistory?: IPaymentStatusHistory[];
}

export interface IPaymentStatusHistory {
  id: string;
  paymentId: string;
  oldStatus: string;
  newStatus: string;
  changedBy?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface IPaymentUpdatePayload {
  status: string;
  method?: string;
  reference?: string;
}
