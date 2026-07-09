"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { storeService } from "@/services/store.service";
import type {
  IStoreCreatePayload,
  IStoreUpdatePayload,
} from "@/types/store.type";

export async function createStoreAction(
  token: string,
  payload: IStoreCreatePayload,
) {
  const { data, error } = await storeService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/stores");
  revalidateTag("stores", "max");
  return { success: true, message: "Store created successfully", data };
}

export async function updateStoreAction(
  token: string,
  id: string,
  payload: IStoreUpdatePayload,
) {
  const { data, error } = await storeService.update(
    token,
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/stores");
  revalidateTag("stores", "max");
  return { success: true, message: "Store updated successfully", data };
}

export async function deleteStoreAction(token: string, id: string) {
  const { error } = await storeService.delete(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/stores");
  revalidateTag("stores", "max");
  return { success: true, message: "Store deleted successfully" };
}
