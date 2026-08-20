"use client";

import { useEffect, useState } from "react";
import { getCuisineTypes, getRestaurants } from "@/lib/api-client";
import { RestaurantCard } from "@/components/restaurants/restaurant-card";
import { RestaurantFiltersBar } from "@/components/restaurants/restaurant-filters";
import { Skeleton } from "@/components/ui/skeleton";
import type { Restaurant, RestaurantFilters } from "@/types/domain";

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCuisineTypes().then(setCuisines);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRestaurants(filters).then((data) => {
      if (!cancelled) {
        setRestaurants(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Рестораны Алматы</h1>
        <p className="text-sm text-muted-foreground">
          Выбирайте кухню, сравнивайте рестораны и заказывайте с доставкой на дом.
        </p>
      </div>

      <RestaurantFiltersBar cuisines={cuisines} filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Ничего не найдено. Попробуйте изменить фильтры.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
