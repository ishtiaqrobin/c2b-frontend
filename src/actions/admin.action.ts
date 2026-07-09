"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { adminService } from "@/services/admin.service";
import type {
  IPromoteStaffPayload,
  IAssignRolePayload,
  IReviewEkycPayload,
} from "@/types/admin.type";

export async function promoteToStaffAction(
  token: string,
  payload: IPromoteStaffPayload,
) {
  const { data, error } = await adminService.promoteToStaff(token, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/users");
  revalidateTag("users", "max");
  return { success: true, message: "User promoted to staff", data };
}

export async function assignRoleAction(
  token: string,
  userId: string,
  payload: IAssignRolePayload,
) {
  const { data, error } = await adminService.assignRole(token, userId, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/users");
  revalidateTag("users", "max");
  return { success: true, message: "Role assigned successfully", data };
}

export async function revokeRoleAction(token: string, userRoleId: string) {
  const { error } = await adminService.revokeRole(token, userRoleId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/users");
  revalidateTag("users", "max");
  return { success: true, message: "Role revoked successfully" };
}

export async function softDeleteUserAction(token: string, userId: string) {
  const { data, error } = await adminService.softDeleteUser(token, userId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/users");
  revalidateTag("users", "max");
  return { success: true, message: "User soft deleted", data };
}

export async function restoreUserAction(token: string, userId: string) {
  const { data, error } = await adminService.restoreUser(token, userId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/users");
  revalidateTag("users", "max");
  return { success: true, message: "User restored", data };
}

export async function reviewEkycAdminAction(
  token: string,
  userId: string,
  payload: IReviewEkycPayload,
) {
  const { data, error } = await adminService.restoreUser(token, userId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/users");
  revalidateTag("users", "max");
  return { success: true, message: "eKYC reviewed", data };
}
