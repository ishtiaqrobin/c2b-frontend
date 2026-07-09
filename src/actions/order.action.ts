"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { orderService } from "@/services/order.service";
import type {
  IOrderCreatePayload,
  IOrderStatusUpdatePayload,
} from "@/types/order.type";

export async function createOrderAction(
  token: string,
  payload: IOrderCreatePayload,
) {
  const { data, error } = await orderService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/orders");
  revalidateTag("orders", "max");
  return { success: true, message: "Order created successfully", data };
}

export async function cancelOrderAction(token: string, id: string) {
  const { data, error } = await orderService.cancel(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/orders");
  revalidateTag("orders", "max");
  return { success: true, message: "Order cancelled successfully", data };
}

export async function updateOrderStatusAction(
  token: string,
  id: string,
  payload: IOrderStatusUpdatePayload,
) {
  const { data, error } = await orderService.updateStatus(token, id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/orders");
  revalidateTag("orders", "max");
  return { success: true, message: "Order status updated successfully", data };
}

export async function updateOrderTrackingAction(
  token: string,
  id: string,
  trackingNumber: string,
) {
  const { data, error } = await orderService.updateTracking(token, id, {
    trackingNumber,
  });
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/orders");
  revalidateTag("orders", "max");
  return {
    success: true,
    message: "Tracking number updated successfully",
    data,
  };
}
