"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { CartSheet } from "@/components/cart/cart-sheet";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
          <UtensilsCrossed className="size-5 text-primary" />
          FoodGo Almaty
        </Link>
        <CartSheet />
      </div>
    </header>
  );
}
