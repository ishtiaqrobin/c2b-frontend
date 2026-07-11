"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { bannerService } from "@/services/banner.service";

export async function createBannerAction(formData: FormData) {
  const { data, error } = await bannerService.create(formData);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/banners");
  revalidateTag("banners", "max");

  return { success: true, message: "Banner created successfully", data };
}

export async function updateBannerAction(id: string, formData: FormData) {
  const { data, error } = await bannerService.update(id, formData);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/banners");
  revalidateTag("banners", "max");

  return { success: true, message: "Banner updated successfully", data };
}

export async function deleteBannerAction(id: string) {
  const { error } = await bannerService.delete(id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/banners");
  revalidateTag("banners", "max");

  return { success: true, message: "Banner deleted successfully" };
}
