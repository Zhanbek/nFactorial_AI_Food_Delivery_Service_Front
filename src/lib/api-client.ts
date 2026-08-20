import { mapRestaurant, mapRestaurantDetail } from "@/lib/mappers";
import {
  MOCK_RESTAURANTS,
  getMockCategories,
  getMockMenuItems,
} from "@/lib/mock-data";
import type {
  ApiChatRequest,
  ApiChatResponse,
  ApiOrderConfirmation,
  ApiOrderPayload,
} from "@/types/api";
import type {
  ChatMessage,
  OrderConfirmation,
  Restaurant,
  RestaurantDetail,
  RestaurantFilters,
} from "@/types/domain";

/**
 * Base URL for the real FastAPI backend. Until it's ready, every function
 * below resolves from local mock data instead of calling `fetch`. Once
 * `NEXT_PUBLIC_API_BASE_URL` is set, swap the mock branch for the fetch
 * branch (kept alongside, commented, in each function) — component code
 * does not need to change since it only ever sees domain types.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const USE_MOCKS = !API_BASE_URL;

const MOCK_LATENCY_MS = 250;
const delay = (ms = MOCK_LATENCY_MS) => new Promise((r) => setTimeout(r, ms));

export async function getRestaurants(
  filters: RestaurantFilters = {},
): Promise<Restaurant[]> {
  if (USE_MOCKS) {
    await delay();
    let results = MOCK_RESTAURANTS.map(mapRestaurant);

    if (filters.city) {
      results = results.filter((r) => r.city === filters.city);
    }
    if (filters.cuisine) {
      results = results.filter((r) => r.cuisineTypes.includes(filters.cuisine!));
    }
    if (filters.priceLevel) {
      results = results.filter((r) => r.priceLevel === filters.priceLevel);
    }
    if (filters.minRating) {
      results = results.filter((r) => r.rating >= filters.minRating!);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    }
    if (filters.sort === "rating") {
      results = [...results].sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === "delivery_time") {
      results = [...results].sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
    } else if (filters.sort === "delivery_fee") {
      results = [...results].sort((a, b) => a.deliveryFee - b.deliveryFee);
    }

    return results;
  }

  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  if (filters.priceLevel) params.set("price_level", String(filters.priceLevel));
  if (filters.minRating) params.set("min_rating", String(filters.minRating));
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);

  const res = await fetch(`${API_BASE_URL}/restaurants?${params}`);
  if (!res.ok) throw new Error(`Failed to load restaurants: ${res.status}`);
  const data = await res.json();
  return data.map(mapRestaurant);
}

export async function getRestaurantBySlug(
  slug: string,
): Promise<RestaurantDetail | null> {
  if (USE_MOCKS) {
    await delay();
    const base = MOCK_RESTAURANTS.find((r) => r.slug === slug);
    if (!base) return null;
    return mapRestaurantDetail({
      ...base,
      categories: getMockCategories(base.id),
      menu_items: getMockMenuItems(base.id),
    });
  }

  const res = await fetch(`${API_BASE_URL}/restaurants/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load restaurant: ${res.status}`);
  return mapRestaurantDetail(await res.json());
}

export async function getCuisineTypes(): Promise<string[]> {
  if (USE_MOCKS) {
    await delay(100);
    const all = MOCK_RESTAURANTS.flatMap((r) => r.cuisine_types);
    return Array.from(new Set(all)).sort();
  }

  const res = await fetch(`${API_BASE_URL}/cuisines`);
  if (!res.ok) throw new Error(`Failed to load cuisines: ${res.status}`);
  return res.json();
}

/** No real checkout — this simulates order submission for the cart flow. */
export async function submitOrder(
  payload: ApiOrderPayload,
): Promise<OrderConfirmation> {
  if (USE_MOCKS) {
    await delay(500);
    const total = payload.items.reduce((sum, item) => sum + item.quantity * 1000, 0);
    const confirmation: ApiOrderConfirmation = {
      id: Math.floor(Math.random() * 100000),
      status: "confirmed",
      total,
      estimated_delivery_min: 35,
    };
    return {
      id: confirmation.id,
      status: confirmation.status,
      total: confirmation.total,
      estimatedDeliveryMin: confirmation.estimated_delivery_min,
    };
  }

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to submit order: ${res.status}`);
  const dto: ApiOrderConfirmation = await res.json();
  return {
    id: dto.id,
    status: dto.status,
    total: dto.total,
    estimatedDeliveryMin: dto.estimated_delivery_min,
  };
}

/**
 * Reserved for the AI Engineer. The chat widget already calls this; today
 * it returns a canned response so the UI is fully wired end-to-end. Point
 * it at the real assistant endpoint by setting NEXT_PUBLIC_API_BASE_URL —
 * no component changes required.
 */
export async function sendChatMessage(
  request: ApiChatRequest,
): Promise<ChatMessage> {
  if (USE_MOCKS) {
    await delay(400);
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "AI-помощник скоро подключится и поможет подобрать ресторан под ваш бюджет и вкус. А пока загляните в каталог!",
      createdAt: new Date().toISOString(),
    };
  }

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);
  const dto: ApiChatResponse = await res.json();
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: dto.reply,
    createdAt: new Date().toISOString(),
  };
}
