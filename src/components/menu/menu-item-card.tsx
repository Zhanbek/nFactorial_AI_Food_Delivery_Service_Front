"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/types/domain";

export function MenuItemCard({
  item,
  restaurantId,
}: {
  item: MenuItem;
  restaurantId: number;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Card className="flex-row items-center gap-3 p-3">
      {item.imageUrl && (
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        </div>
      )}
      <CardContent className="flex flex-1 flex-col gap-1 p-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{item.name}</p>
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-medium">{formatPrice(item.price)}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={!item.isAvailable}
            onClick={() => addItem(item, restaurantId)}
          >
            <Plus data-icon="inline-start" />
            {item.isAvailable ? "В корзину" : "Недоступно"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
