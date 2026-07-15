"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { faqService } from "@/services/faq.service";
import type { IFaq } from "@/types/faq.type";

export async function createFaqAction(data: Partial<IFaq>) {
  const { data: result, error } = await faqService.create(data);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/faqs");
  revalidateTag("faqs", "max");

  return { success: true, message: "FAQ created successfully", data: result };
}

export async function updateFaqAction(id: string, data: Partial<IFaq>) {
  const { data: result, error } = await faqService.update(id, data);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/faqs");
  revalidateTag("faqs", "max");

  return { success: true, message: "FAQ updated successfully", data: result };
}

export async function deleteFaqAction(id: string) {
  const { error } = await faqService.delete(id);
  if (error) return { success: false, message: error.message };

  revalidatePath("/admin-dashboard/faqs");
  revalidateTag("faqs", "max");

  return { success: true, message: "FAQ deleted successfully" };
}
