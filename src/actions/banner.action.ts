"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { bannerService } from "@/services/banner.service";
import type {
  IBannerCreatePayload,
  IBannerUpdatePayload,
} from "@/types/banner.type";

export async function createBannerAction(
  token: string,
  payload: IBannerCreatePayload,
) {
  const { data, error } = await bannerService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/banners");
  revalidateTag("banners", "max");
  return { success: true, message: "Banner created successfully", data };
}

export async function updateBannerAction(
  token: string,
  id: string,
  payload: IBannerUpdatePayload,
) {
  const { data, error } = await bannerService.update(
    token,
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/banners");
  revalidateTag("banners", "max");
  return { success: true, message: "Banner updated successfully", data };
}

export async function deleteBannerAction(token: string, id: string) {
  const { error } = await bannerService.delete(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/banners");
  revalidateTag("banners", "max");
  return { success: true, message: "Banner deleted successfully" };
}
