"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { Star, Clock, Bike, MapPin } from "lucide-react";
import { getRestaurantBySlug } from "@/lib/api-client";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice, formatRating, PRICE_LEVEL_LABEL } from "@/lib/format";
import type { RestaurantDetail } from "@/types/domain";
import { notFound } from "next/navigation";

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null | undefined>(
    undefined,
  );

  useEffect(() => {
    getRestaurantBySlug(slug).then(setRestaurant);
  }, [slug]);

  if (restaurant === undefined) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8">
        <Skeleton className="aspect-[3/1] w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (restaurant === null) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl">
        <Image src={restaurant.imageUrl} alt={restaurant.name} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold">{restaurant.name}</h1>
          {!restaurant.isOpen && <Badge variant="secondary">Закрыто</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{restaurant.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {formatRating(restaurant.rating)} ({restaurant.ratingCount})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} мин
          </span>
          <span className="flex items-center gap-1">
            <Bike className="size-4" />
            {formatPrice(restaurant.deliveryFee)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {restaurant.address}
          </span>
          <span>{PRICE_LEVEL_LABEL[restaurant.priceLevel]}</span>
        </div>
      </div>

      <Tabs defaultValue={String(restaurant.categories[0]?.id)}>
        <TabsList>
          {restaurant.categories.map((category) => (
            <TabsTrigger key={category.id} value={String(category.id)}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {restaurant.categories.map((category) => (
          <TabsContent key={category.id} value={String(category.id)} className="flex flex-col gap-3">
            {restaurant.menuItems
              .filter((item) => item.categoryId === category.id)
              .map((item) => (
                <MenuItemCard key={item.id} item={item} restaurantId={restaurant.id} />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
