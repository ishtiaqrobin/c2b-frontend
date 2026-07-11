"use server";

import { userService } from "@/services/user.service";
import type {
  RegisterIndividualFormValues,
  RegisterCorporationFormValues,
} from "@/lib/validation";

export async function registerIndividualAction(
  payload: RegisterIndividualFormValues,
) {
  const { data, error } = await userService.register(
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  return {
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
    data,
  };
}

export async function registerCorporationAction(
  payload: RegisterCorporationFormValues,
) {
  const { data, error } = await userService.register(
    payload as unknown as Record<string, unknown>,
  );
  if (error) return { success: false, message: error.message };
  return {
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
    data,
  };
}
