"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { categoryService } from "@/services/category.service";
import type {
  ICategoryCreatePayload,
  ICategoryUpdatePayload,
} from "@/types/category.type";

export async function createCategory(payload: ICategoryCreatePayload) {
  const { data, error } = await categoryService.create(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Category created successfully", data };
}

export async function updateCategory(
  id: string,
  payload: ICategoryUpdatePayload,
) {
  const { data, error } = await categoryService.update(id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Category updated successfully", data };
}

export async function deleteCategory(id: string) {
  const { error } = await categoryService.delete(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/categories");
  revalidateTag("categories", "max");
  return { success: true, message: "Category deleted successfully" };
}
