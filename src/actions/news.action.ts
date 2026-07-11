"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { newsService } from "@/services/news.service";
import type { INewsCreatePayload, INewsUpdatePayload } from "@/types/news.type";

export async function createNewsAction(payload: INewsCreatePayload) {
  const { data, error } = await newsService.create(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/news");
  revalidateTag("news");
  return { success: true, message: "News created successfully", data };
}

export async function updateNewsAction(id: string, payload: INewsUpdatePayload) {
  const { data, error } = await newsService.update(id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/news");
  revalidateTag("news");
  return { success: true, message: "News updated successfully", data };
}

export async function deleteNewsAction(id: string) {
  const { error } = await newsService.delete(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/news");
  revalidateTag("news");
  return { success: true, message: "News deleted successfully" };
}
