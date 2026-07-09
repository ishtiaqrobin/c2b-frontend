import { IProductVariant } from "./product.type";

export interface ICart {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  id: string;
  cartId: string;
  variantId: string;
  condition: "NEW" | "LIKE_NEW" | "USED" | "DAMAGED";
  quantity: number;
  notes?: string | null;
  expiresAt: string;
  variant?: IProductVariant;
  deductions?: ICartItemDeduction[];
}

export interface ICartItemDeduction {
  id: string;
  cartItemId: string;
  deductionId: string;
}

export interface ICartItemAddPayload {
  variantId: string;
  condition: "NEW" | "LIKE_NEW" | "USED" | "DAMAGED";
  quantity?: number;
  notes?: string;
  deductionIds?: string[];
}

export interface ICartItemUpdatePayload {
  quantity?: number;
  condition?: "NEW" | "LIKE_NEW" | "USED" | "DAMAGED";
  notes?: string;
  deductionIds?: string[];
}

export interface ICartItemRemovePayload {
  itemIds: string[];
}
