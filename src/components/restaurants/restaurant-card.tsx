import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Restaurant } from "@/types/domain";
import { formatPrice, formatRating, PRICE_LEVEL_LABEL } from "@/lib/format";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant.slug}`}>
      <Card className="h-full gap-0 py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="secondary">Закрыто</Badge>
            </div>
          )}
        </div>
        <CardHeader className="pt-4">
          <CardTitle className="flex items-center justify-between gap-2">
            <span>{restaurant.name}</span>
            <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {formatRating(restaurant.rating)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pb-4">
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {restaurant.cuisineTypes.join(", ")} · {PRICE_LEVEL_LABEL[restaurant.priceLevel]}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} мин
            </span>
            <span className="flex items-center gap-1">
              <Bike className="size-3.5" />
              {formatPrice(restaurant.deliveryFee)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
