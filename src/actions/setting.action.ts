"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { settingService } from "@/services/setting.service";

export async function updateSettingsAction(
  payload: Record<string, unknown>,
  token: string,
) {
  const { data, error } = await settingService.updateSettings(token, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/settings");
  revalidateTag("settings", "max");
  return { success: true, message: "Settings updated successfully", data };
}
