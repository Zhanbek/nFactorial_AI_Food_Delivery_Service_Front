"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { submitOrder } from "@/lib/api-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import type { OrderConfirmation } from "@/types/domain";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const restaurantId = useCartStore((s) => s.restaurantId);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const totalPrice = useCartStore((s) => s.totalPrice());

  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  async function handleCheckout() {
    if (!restaurantId || items.length === 0) return;
    setSubmitting(true);
    try {
      const result = await submitOrder({
        restaurant_id: restaurantId,
        items: items.map((i) => ({ menu_item_id: i.menuItemId, quantity: i.quantity })),
        comment: comment || undefined,
      });
      setConfirmation(result);
      clear();
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-16 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <h1 className="font-heading text-xl font-semibold">Заказ №{confirmation.id} оформлен</h1>
        <p className="text-sm text-muted-foreground">
          Ожидаемое время доставки: ~{confirmation.estimatedDeliveryMin} мин. Сумма:{" "}
          {formatPrice(confirmation.total)}. Оплата не выполнялась — это демо-заказ.
        </p>
        <Link href="/" className={buttonVariants({ className: "mt-2" })}>
          Вернуться к ресторанам
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Ваша корзина пуста.</p>
        <Link href="/" className={buttonVariants()}>Выбрать ресторан</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold">Ваш заказ</h1>

      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.menuItemId} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
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
                aria-label="Удалить"
              >
                <Trash2 />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="comment">Комментарий к заказу</Label>
        <Textarea
          id="comment"
          placeholder="Например: без лука, домофон не работает..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between border-t pt-4 text-base font-medium">
        <span>Итого</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      <Button size="lg" disabled={submitting} onClick={handleCheckout}>
        {submitting ? "Оформляем..." : "Подтвердить заказ"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Демо-режим: реальная оплата и доставка не выполняются.
      </p>
    </div>
  );
}
