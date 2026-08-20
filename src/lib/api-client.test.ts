import { describe, expect, it } from "vitest";
import { getCuisineTypes, getRestaurantBySlug, getRestaurants } from "./api-client";

describe("api-client (mock mode)", () => {
  it("lists all mock restaurants without filters", async () => {
    const restaurants = await getRestaurants();
    expect(restaurants.length).toBeGreaterThan(0);
  });

  it("filters by cuisine", async () => {
    const restaurants = await getRestaurants({ cuisine: "Пицца" });
    expect(restaurants.length).toBeGreaterThan(0);
    for (const r of restaurants) {
      expect(r.cuisineTypes).toContain("Пицца");
    }
  });

  it("filters by minRating", async () => {
    const restaurants = await getRestaurants({ minRating: 4.7 });
    for (const r of restaurants) {
      expect(r.rating).toBeGreaterThanOrEqual(4.7);
    }
  });

  it("sorts by rating descending", async () => {
    const restaurants = await getRestaurants({ sort: "rating" });
    for (let i = 1; i < restaurants.length; i++) {
      expect(restaurants[i - 1].rating).toBeGreaterThanOrEqual(restaurants[i].rating);
    }
  });

  it("returns null for an unknown slug", async () => {
    const restaurant = await getRestaurantBySlug("does-not-exist");
    expect(restaurant).toBeNull();
  });

  it("returns categories and menu items for a known slug", async () => {
    const restaurant = await getRestaurantBySlug("dastarkhan-almaty");
    expect(restaurant).not.toBeNull();
    expect(restaurant!.categories.length).toBeGreaterThan(0);
    expect(restaurant!.menuItems.length).toBeGreaterThan(0);
  });

  it("returns a de-duplicated, sorted cuisine list", async () => {
    const cuisines = await getCuisineTypes();
    expect(new Set(cuisines).size).toBe(cuisines.length);
    expect([...cuisines].sort()).toEqual(cuisines);
  });
});
