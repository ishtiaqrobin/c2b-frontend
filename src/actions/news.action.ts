"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { newsService } from "@/services/news.service";
import type { INewsCreatePayload, INewsUpdatePayload } from "@/types/news.type";

export async function createNewsAction(
  token: string,
  payload: INewsCreatePayload,
) {
  const { data, error } = await newsService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/news");
  revalidateTag("news", "max");
  return { success: true, message: "News created successfully", data };
}

export async function updateNewsAction(
  token: string,
  id: string,
  payload: INewsUpdatePayload,
) {
  const { data, error } = await newsService.update(
    token,
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/news");
  revalidateTag("news", "max");
  return { success: true, message: "News updated successfully", data };
}

export async function deleteNewsAction(token: string, id: string) {
  const { error } = await newsService.delete(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/news");
  revalidateTag("news", "max");
  return { success: true, message: "News deleted successfully" };
}
