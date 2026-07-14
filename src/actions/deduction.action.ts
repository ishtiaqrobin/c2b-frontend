"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { productService } from "@/services/product.service";
import type {
  IDeductionCreatePayload,
  IDeductionUpdatePayload,
} from "@/types/product.type";

export async function createDeductionAction(
  variantId: string,
  payload: IDeductionCreatePayload,
) {
  const { data, error } = await productService.createDeduction(
    variantId,
    payload,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Deduction created successfully", data };
}

export async function updateDeductionAction(
  deductionId: string,
  payload: IDeductionUpdatePayload,
) {
  const { data, error } = await productService.updateDeduction(
    deductionId,
    payload,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Deduction updated successfully", data };
}

export async function deleteDeductionAction(deductionId: string) {
  const { error } = await productService.deleteDeduction(deductionId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Deduction deleted successfully" };
}
