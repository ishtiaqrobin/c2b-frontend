"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { categoryService } from "@/services/category.service";
import type {
  ICategoryCreatePayload,
  ICategoryUpdatePayload,
  INoticeCreatePayload,
  INoticeUpdatePayload,
} from "@/types/category.type";

export async function createCategoryAction(
  token: string,
  payload: ICategoryCreatePayload,
) {
  const { data, error } = await categoryService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Category created successfully", data };
}

export async function updateCategoryAction(
  token: string,
  id: string,
  payload: ICategoryUpdatePayload,
) {
  const { data, error } = await categoryService.update(
    token,
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Category updated successfully", data };
}

export async function deleteCategoryAction(token: string, id: string) {
  const { error } = await categoryService.delete(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Category deleted successfully" };
}

export async function createNoticeAction(
  token: string,
  payload: INoticeCreatePayload,
) {
  const { data, error } = await categoryService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Notice created successfully", data };
}

export async function updateNoticeAction(
  token: string,
  categoryId: string,
  payload: INoticeUpdatePayload,
) {
  const { data, error } = await categoryService.update(
    token,
    categoryId,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Notice updated successfully", data };
}

export async function deleteNoticeAction(token: string, categoryId: string) {
  const { error } = await categoryService.delete(token, categoryId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Notice deleted successfully" };
}
