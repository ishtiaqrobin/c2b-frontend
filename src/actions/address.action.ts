"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { addressService } from "@/services/address.service";
import type {
  IAddressCreatePayload,
  IAddressUpdatePayload,
} from "@/types/address.type";

export async function createAddressAction(payload: IAddressCreatePayload) {
  const { data, error } = await addressService.create(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/addresses");
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Address created successfully", data };
}

export async function updateAddressAction(
  id: string,
  payload: IAddressUpdatePayload,
) {
  const { data, error } = await addressService.update(id, payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/addresses");
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Address updated successfully", data };
}

export async function deleteAddressAction(id: string) {
  const { error } = await addressService.delete(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/addresses");
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Address deleted successfully" };
}

export async function setDefaultAddressAction(id: string) {
  const { data, error } = await addressService.setDefault(id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin-dashboard/addresses");
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Default address updated", data };
}
