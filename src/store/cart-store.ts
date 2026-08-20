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
