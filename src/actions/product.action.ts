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

export async function createProductAction(
  token: string,
  payload: IProductCreatePayload,
) {
  const { data, error } = await productService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products", "max");
  return { success: true, message: "Product created successfully", data };
}

export async function updateProductAction(
  token: string,
  id: string,
  payload: IProductUpdatePayload,
) {
  const { data, error } = await productService.update(
    token,
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products", "max");
  return { success: true, message: "Product updated successfully", data };
}

export async function deleteProductAction(token: string, id: string) {
  const { error } = await productService.delete(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products", "max");
  return { success: true, message: "Product deleted successfully" };
}

export async function createVariantAction(
  token: string,
  productId: string,
  payload: IVariantCreatePayload,
) {
  const { data, error } = await productService.createVariant(
    token,
    productId,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products", "max");
  return { success: true, message: "Variant created successfully", data };
}

export async function updateVariantAction(
  token: string,
  id: string,
  payload: IVariantUpdatePayload,
) {
  const { data, error } = await productService.updateVariant(
    token,
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products", "max");
  return { success: true, message: "Variant updated successfully", data };
}

export async function deleteVariantAction(token: string, id: string) {
  const { error } = await productService.deleteVariant(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products", "max");
  return { success: true, message: "Variant deleted successfully" };
}

export async function updatePriceAction(
  token: string,
  variantId: string,
  payload: IPriceUpdatePayload,
) {
  const { data, error } = await productService.updatePrice(
    token,
    variantId,
    payload,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/products");
  revalidateTag("products", "max");
  return { success: true, message: "Price updated successfully", data };
}
