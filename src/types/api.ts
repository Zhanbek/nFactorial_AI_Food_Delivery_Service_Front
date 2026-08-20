/**
 * Raw API DTOs — mirror the FastAPI/Pydantic response shape (snake_case)
 * exactly as the backend will serve them. Nothing in the UI should import
 * these directly; go through `src/lib/mappers.ts` into the domain types
 * in `src/types/domain.ts` instead. When the real backend is ready, only
 * `src/lib/api-client.ts` needs to change (mock -> fetch).
 */

export interface ApiRestaurant {
  id: number;
  slug: string;
  name: string;
  description: string;
  cuisine_types: string[];
  city: string;
  address: string;
  rating: number;
  rating_count: number;
  price_level: 1 | 2 | 3;
  delivery_time_min: number;
  delivery_time_max: number;
  delivery_fee: number;
  min_order_amount: number;
  image_url: string;
  is_open: boolean;
  tags: string[];
}

export interface ApiMenuCategory {
  id: number;
  restaurant_id: number;
  name: string;
  sort_order: number;
}

export interface ApiMenuItem {
  id: number;
  restaurant_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_available: boolean;
  tags: string[];
}

export interface ApiRestaurantDetail extends ApiRestaurant {
  categories: ApiMenuCategory[];
  menu_items: ApiMenuItem[];
}

export interface ApiRestaurantListParams {
  city?: string;
  cuisine?: string;
  price_level?: number;
  min_rating?: number;
  search?: string;
  sort?: "rating" | "delivery_time" | "delivery_fee";
}

export interface ApiOrderItemPayload {
  menu_item_id: number;
  quantity: number;
}

export interface ApiOrderPayload {
  restaurant_id: number;
  items: ApiOrderItemPayload[];
  comment?: string;
}

export interface ApiOrderConfirmation {
  id: number;
  status: "pending" | "confirmed";
  total: number;
  estimated_delivery_min: number;
}

/** Contract reserved for the AI Engineer's chat/recommendation endpoint. */
export interface ApiChatRequest {
  message: string;
  restaurant_id?: number;
  budget?: number;
  preferences?: string[];
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface ApiChatResponse {
  reply: string;
  suggested_restaurant_ids?: number[];
}
