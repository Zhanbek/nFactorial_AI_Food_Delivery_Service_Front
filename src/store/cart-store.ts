import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, MenuItem } from "@/types/domain";

interface CartState {
  restaurantId: number | null;
  items: CartItem[];
  addItem: (item: MenuItem, restaurantId: number) => void;
  removeItem: (menuItemId: number) => void;
  setQuantity: (menuItemId: number, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      items: [],

      addItem: (item, restaurantId) =>
        set((state) => {
          // Cart is single-restaurant, mirroring real delivery apps: adding
          // from a different restaurant replaces the cart instead of mixing orders.
          if (state.restaurantId !== null && state.restaurantId !== restaurantId) {
            return {
              restaurantId,
              items: [
                {
                  menuItemId: item.id,
                  restaurantId,
                  name: item.name,
                  price: item.price,
                  imageUrl: item.imageUrl,
                  quantity: 1,
                },
              ],
            };
          }

          const existing = state.items.find((i) => i.menuItemId === item.id);
          if (existing) {
            return {
              restaurantId,
              items: state.items.map((i) =>
                i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }

          return {
            restaurantId,
            items: [
              ...state.items,
              {
                menuItemId: item.id,
                restaurantId,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (menuItemId) =>
        set((state) => {
          const items = state.items.filter((i) => i.menuItemId !== menuItemId);
          return { items, restaurantId: items.length ? state.restaurantId : null };
        }),

      setQuantity: (menuItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const items = state.items.filter((i) => i.menuItemId !== menuItemId);
            return { items, restaurantId: items.length ? state.restaurantId : null };
          }
          return {
            items: state.items.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i,
            ),
          };
        }),

      clear: () => set({ items: [], restaurantId: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    { name: "food-delivery-cart" },
  ),
);

/**
 * The persisted cart only rehydrates from localStorage on the client, so the
 * first client render must report `false` (matching SSR) even though the
 * store may already hold real data by then — otherwise React flags a
 * hydration mismatch on anything derived from cart contents (e.g. the cart
 * count badge).
 */
export function useCartHasHydrated() {
  return useSyncExternalStore(
    // `persist` is only attached in the browser; on the server there is
    // nothing to subscribe to, so report no-op (server snapshot covers it).
    (callback) => useCartStore.persist?.onFinishHydration(callback) ?? (() => {}),
    () => useCartStore.persist?.hasHydrated() ?? false,
    () => false,
  );
}
