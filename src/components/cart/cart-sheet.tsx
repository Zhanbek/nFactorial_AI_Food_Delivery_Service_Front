"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";

export function CartSheet() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalItems = useCartStore((s) => s.totalItems());
  const totalPrice = useCartStore((s) => s.totalPrice());

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm">
            <ShoppingBag data-icon="inline-start" />
            Корзина
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ваша корзина</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Корзина пуста. Выберите блюда в меню ресторана.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.menuItemId} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setQuantity(item.menuItemId, item.quantity - 1)}
                      aria-label="Уменьшить количество"
                    >
                      <Minus />
                    </Button>
                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setQuantity(item.menuItemId, item.quantity + 1)}
                      aria-label="Увеличить количество"
                    >
                      <Plus />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.menuItemId)}
                      aria-label="Удалить из корзины"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Итого</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Button render={<Link href="/cart" />} className="w-full">
              Оформить заказ
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
