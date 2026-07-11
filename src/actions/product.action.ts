"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { productService } from "@/services/product.service";
import type {
  IProductCreatePayload,
  IProductUpdatePayload,
  IVariantCreatePayload,
  IVariantUpdatePayload,
  IPriceUpdatePayload,
} from "@/types/product.type";

export async function createProductAction(payload: IProductCreatePayload) {
  const { data, error } = await productService.create(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Product created successfully", data };
}

export async function updateProductAction(
  id: string,
  payload: IProductUpdatePayload,
) {
  const { data, error } = await productService.update(id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Product updated successfully", data };
}

export async function deleteProductAction(id: string) {
  const { error } = await productService.delete(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Product deleted successfully" };
}

export async function createVariantAction(
  productId: string,
  payload: IVariantCreatePayload,
) {
  const { data, error } = await productService.createVariant(productId, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Variant created successfully", data };
}

export async function updateVariantAction(
  id: string,
  payload: IVariantUpdatePayload,
) {
  const { data, error } = await productService.updateVariant(id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Variant updated successfully", data };
}

export async function deleteVariantAction(id: string) {
  const { error } = await productService.deleteVariant(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Variant deleted successfully" };
}

export async function updatePriceAction(
  variantId: string,
  payload: IPriceUpdatePayload,
) {
  const { data, error } = await productService.updatePrice(variantId, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products");
  return { success: true, message: "Price updated successfully", data };
}
