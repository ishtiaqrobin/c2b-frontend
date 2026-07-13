"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { storeService } from "@/services/store.service";
import type {
  IStoreCreatePayload,
  IStoreUpdatePayload,
} from "@/types/store.type";

export async function createStoreAction(payload: IStoreCreatePayload) {
  const { data, error } = await storeService.create(
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/stores");
  revalidateTag("stores", "max");
  return { success: true, message: "Store created successfully", data };
}

export async function updateStoreAction(
  id: string,
  payload: IStoreUpdatePayload,
) {
  const { data, error } = await storeService.update(
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/stores");
  revalidateTag("stores", "max");
  return { success: true, message: "Store updated successfully", data };
}

export async function deleteStoreAction(id: string) {
  const { error } = await storeService.delete(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/stores");
  revalidateTag("stores", "max");
  return { success: true, message: "Store deleted successfully" };
}
