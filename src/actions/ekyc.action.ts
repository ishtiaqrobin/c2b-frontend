"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { ekycService } from "@/services/ekyc.service";

export async function uploadEkycDocumentAction(
  token: string,
  formData: FormData,
) {
  const { data, error } = await ekycService.uploadDocument(token, formData);
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/ekyc");
  revalidateTag("ekyc", "max");
  return { success: true, message: "Document uploaded successfully", data };
}

export async function removeEkycDocumentAction(
  token: string,
  documentId: string,
) {
  const { data, error } = await ekycService.removeDocument(token, documentId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/ekyc");
  revalidateTag("ekyc", "max");
  return { success: true, message: "Document removed successfully", data };
}

export async function reviewEkycAction(
  token: string,
  id: string,
  payload: { status: "VERIFIED" | "REJECTED"; rejectReason?: string },
) {
  const { data, error } = await ekycService.reviewEkyc(token, id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/ekyc");
  revalidateTag("ekyc", "max");
  return { success: true, message: "eKYC review completed", data };
}
