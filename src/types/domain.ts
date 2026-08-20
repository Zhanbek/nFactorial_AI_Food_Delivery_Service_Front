/**
 * Domain models used throughout the UI (camelCase). Produced from the raw
 * API DTOs by `src/lib/mappers.ts`, so components never depend on the
 * backend's exact field naming.
 */

export interface Restaurant {
  id: number;
  slug: string;
  name: string;
  description: string;
  cuisineTypes: string[];
  city: string;
  address: string;
  rating: number;
  ratingCount: number;
  priceLevel: 1 | 2 | 3;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  deliveryFee: number;
  minOrderAmount: number;
  imageUrl: string;
  isOpen: boolean;
  tags: string[];
}

export interface MenuCategory {
  id: number;
  restaurantId: number;
  name: string;
  sortOrder: number;
}

export interface MenuItem {
  id: number;
  restaurantId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  tags: string[];
}

export interface RestaurantDetail extends Restaurant {
  categories: MenuCategory[];
  menuItems: MenuItem[];
}

export interface RestaurantFilters {
  city?: string;
  cuisine?: string;
  priceLevel?: number;
  minRating?: number;
  search?: string;
  sort?: "rating" | "delivery_time" | "delivery_fee";
}

export interface CartItem {
  menuItemId: number;
  restaurantId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export interface OrderConfirmation {
  id: number;
  status: "pending" | "confirmed";
  total: number;
  estimatedDeliveryMin: number;
}

/** Reserved for the AI chat feature the AI Engineer will wire up later. */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
