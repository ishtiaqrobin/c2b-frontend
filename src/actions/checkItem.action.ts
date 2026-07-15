"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { checkItemService } from "@/services/checkItem.service";
import type {
  ICheckItemCreatePayload,
  ICheckItemUpdatePayload,
} from "@/types/checkItem.type";

export async function createCheckItemAction(payload: ICheckItemCreatePayload) {
  const { data, error } = await checkItemService.create(payload);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/check-items");
  revalidateTag("check-items", "max");

  return { success: true, message: "Check item created successfully", data };
}

export async function updateCheckItemAction(
  id: string,
  payload: ICheckItemUpdatePayload,
) {
  const { data, error } = await checkItemService.update(id, payload);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/check-items");
  revalidateTag("check-items", "max");

  return { success: true, message: "Check item updated successfully", data };
}

export async function deleteCheckItemAction(id: string) {
  const { error } = await checkItemService.delete(id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/check-items");
  revalidateTag("check-items", "max");

  return { success: true, message: "Check item deleted successfully" };
}
