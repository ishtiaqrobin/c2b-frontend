"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { addressService } from "@/services/address.service";
import type {
  IAddressCreatePayload,
  IAddressUpdatePayload,
} from "@/types/address.type";

export async function createAddressAction(
  token: string,
  payload: IAddressCreatePayload,
) {
  const { data, error } = await addressService.create(
    token,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Address created successfully", data };
}

export async function updateAddressAction(
  token: string,
  id: string,
  payload: IAddressUpdatePayload,
) {
  const { data, error } = await addressService.update(
    token,
    id,
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Address updated successfully", data };
}

export async function deleteAddressAction(token: string, id: string) {
  const { error } = await addressService.delete(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Address deleted successfully" };
}

export async function setDefaultAddressAction(token: string, id: string) {
  const { data, error } = await addressService.setDefault(token, id);
  if (error) return { success: false, message: error.message };
  revalidatePath("/user-dashboard/addresses");
  revalidateTag("addresses", "max");
  return { success: true, message: "Default address set", data };
}
