import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

interface ICreateContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  createContact: async function (
    payload: ICreateContactInput,
  ): Promise<{ data: unknown | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<unknown> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return { data: null, error: { message: err instanceof Error ? err.message : "Error sending message" } };
    }
  },
};
