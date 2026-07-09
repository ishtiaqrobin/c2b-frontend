"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { notificationService } from "@/services/notification.service";
import type { INotificationCreatePayload } from "@/types/notification.type";

export async function markNotificationReadAction(token: string, id: string) {
  const { data, error } = await notificationService.markAsRead(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/notifications");
  revalidateTag("notifications", "max");
  return { success: true, message: "Marked as read", data };
}

export async function markAllNotificationsReadAction(token: string) {
  const { error } = await notificationService.markAllAsRead(token);
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/notifications");
  revalidateTag("notifications", "max");
  return { success: true, message: "All marked as read" };
}

export async function createNotificationAction(
  token: string,
  payload: INotificationCreatePayload,
) {
  const { data, error } = await notificationService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/notifications");
  revalidateTag("notifications", "max");
  return { success: true, message: "Notification created successfully", data };
}

export async function deleteNotificationAction(token: string, id: string) {
  const { error } = await notificationService.delete(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/notifications");
  revalidateTag("notifications", "max");
  return { success: true, message: "Notification deleted successfully" };
}
