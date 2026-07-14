"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { buybackFeatureService } from "@/services/buybackFeature.service";

export async function createBuybackFeatureAction(formData: FormData) {
  const { data, error } = await buybackFeatureService.create(formData);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/buyback-features");
  revalidateTag("buyback-features", "max");

  return { success: true, message: "Buyback feature created successfully", data };
}

export async function updateBuybackFeatureAction(id: string, formData: FormData) {
  const { data, error } = await buybackFeatureService.update(id, formData);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/buyback-features");
  revalidateTag("buyback-features", "max");

  return { success: true, message: "Buyback feature updated successfully", data };
}

export async function deleteBuybackFeatureAction(id: string) {
  const { error } = await buybackFeatureService.delete(id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/buyback-features");
  revalidateTag("buyback-features", "max");

  return { success: true, message: "Buyback feature deleted successfully" };
}
