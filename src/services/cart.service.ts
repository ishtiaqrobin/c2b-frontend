import { env } from "@/env";
import type { ApiResponse } from "@/types/api.type";
import type { ICart } from "@/types/cart.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

interface ServiceError {
  message: string;
}

export const cartService = {
  /** GET /cart/my — Get my cart */
  getMyCart: async function (
    token: string,
  ): Promise<{ data: ICart | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/cart/my`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const response: ApiResponse<ICart> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error fetching cart",
        },
      };
    }
  },

  /** POST /cart/items — Add item to cart */
  addItem: async function (
    token: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: ICart | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICart> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error adding to cart",
        },
      };
    }
  },

  /** PATCH /cart/items/:itemId — Update cart item */
  updateItem: async function (
    token: string,
    itemId: string,
    payload: Record<string, unknown>,
  ): Promise<{ data: ICart | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICart> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error updating cart item",
        },
      };
    }
  },

  /** DELETE /cart/items — Remove items from cart */
  removeItems: async function (
    token: string,
    payload: { itemIds: string[] },
  ): Promise<{ data: ICart | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICart> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err instanceof Error ? err.message : "Error removing cart items",
        },
      };
    }
  },

  /** DELETE /cart/my — Clear cart */
  clearCart: async function (
    token: string,
  ): Promise<{ data: null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/cart/my`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return { data: null, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error clearing cart",
        },
      };
    }
  },

  /** POST /cart/merge — Merge guest cart after login */
  mergeCart: async function (
    token: string,
    payload: { sessionId: string },
  ): Promise<{ data: ICart | null; error: ServiceError | null }> {
    try {
      const res = await fetch(`${API_URL}/cart/merge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      const response: ApiResponse<ICart> = await res.json();
      return { data: response.data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : "Error merging cart",
        },
      };
    }
  },
};
