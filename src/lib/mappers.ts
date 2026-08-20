import type {
  ApiMenuCategory,
  ApiMenuItem,
  ApiRestaurant,
  ApiRestaurantDetail,
} from "@/types/api";
import type {
  MenuCategory,
  MenuItem,
  Restaurant,
  RestaurantDetail,
} from "@/types/domain";

export function mapRestaurant(dto: ApiRestaurant): Restaurant {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    description: dto.description,
    cuisineTypes: dto.cuisine_types,
    city: dto.city,
    address: dto.address,
    rating: dto.rating,
    ratingCount: dto.rating_count,
    priceLevel: dto.price_level,
    deliveryTimeMin: dto.delivery_time_min,
    deliveryTimeMax: dto.delivery_time_max,
    deliveryFee: dto.delivery_fee,
    minOrderAmount: dto.min_order_amount,
    imageUrl: dto.image_url,
    isOpen: dto.is_open,
    tags: dto.tags,
  };
}

export function mapMenuCategory(dto: ApiMenuCategory): MenuCategory {
  return {
    id: dto.id,
    restaurantId: dto.restaurant_id,
    name: dto.name,
    sortOrder: dto.sort_order,
  };
}

export function mapMenuItem(dto: ApiMenuItem): MenuItem {
  return {
    id: dto.id,
    restaurantId: dto.restaurant_id,
    categoryId: dto.category_id,
    name: dto.name,
    description: dto.description,
    price: dto.price,
    imageUrl: dto.image_url,
    isAvailable: dto.is_available,
    tags: dto.tags,
  };
}

export function mapRestaurantDetail(dto: ApiRestaurantDetail): RestaurantDetail {
  return {
    ...mapRestaurant(dto),
    categories: dto.categories.map(mapMenuCategory),
    menuItems: dto.menu_items.map(mapMenuItem),
  };
}
