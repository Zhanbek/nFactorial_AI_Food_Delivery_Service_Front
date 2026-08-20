import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "./cart-store";
import type { MenuItem } from "@/types/domain";

const item1: MenuItem = {
  id: 101,
  restaurantId: 1,
  categoryId: 12,
  name: "Бешбармак",
  description: "",
  price: 3800,
  imageUrl: null,
  isAvailable: true,
  tags: [],
};

const item2: MenuItem = {
  id: 201,
  restaurantId: 2,
  categoryId: 22,
  name: "Ролл Филадельфия",
  description: "",
  price: 3200,
  imageUrl: null,
  isAvailable: true,
  tags: [],
};

beforeEach(() => {
  useCartStore.setState({ items: [], restaurantId: null });
});

describe("cart-store", () => {
  it("adds a new item", () => {
    useCartStore.getState().addItem(item1, 1);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
    expect(state.restaurantId).toBe(1);
  });

  it("increments quantity when the same item is added again", () => {
    useCartStore.getState().addItem(item1, 1);
    useCartStore.getState().addItem(item1, 1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("replaces the cart when adding from a different restaurant", () => {
    useCartStore.getState().addItem(item1, 1);
    useCartStore.getState().addItem(item2, 2);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].menuItemId).toBe(item2.id);
    expect(state.restaurantId).toBe(2);
  });

  it("removes the item and clears restaurantId once the cart is empty", () => {
    useCartStore.getState().addItem(item1, 1);
    useCartStore.getState().removeItem(item1.id);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.restaurantId).toBeNull();
  });

  it("setQuantity to 0 removes the item", () => {
    useCartStore.getState().addItem(item1, 1);
    useCartStore.getState().setQuantity(item1.id, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("computes totalItems and totalPrice", () => {
    useCartStore.getState().addItem(item1, 1);
    useCartStore.getState().setQuantity(item1.id, 3);
    const state = useCartStore.getState();
    expect(state.totalItems()).toBe(3);
    expect(state.totalPrice()).toBe(3800 * 3);
  });
});
