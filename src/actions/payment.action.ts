"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { paymentService } from "@/services/payment.service";
import type { IPaymentUpdatePayload } from "@/types/payment.type";

export async function updatePaymentAction(
  token: string,
  id: string,
  payload: IPaymentUpdatePayload,
) {
  const { data, error } = await paymentService.update(token, id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/payments");
  revalidateTag("payments", "max");
  return { success: true, message: "Payment updated successfully", data };
}
