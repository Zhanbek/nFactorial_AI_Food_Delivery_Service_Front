"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RestaurantFilters } from "@/types/domain";

interface Props {
  cuisines: string[];
  filters: RestaurantFilters;
  onChange: (filters: RestaurantFilters) => void;
}

const PRICE_OPTIONS = [
  { value: "1", label: "$ — доступно" },
  { value: "2", label: "$$ — средне" },
  { value: "3", label: "$$$ — премиум" },
];

const SORT_OPTIONS = [
  { value: "rating", label: "По рейтингу" },
  { value: "delivery_time", label: "По времени доставки" },
  { value: "delivery_fee", label: "По стоимости доставки" },
];

export function RestaurantFiltersBar({ cuisines, filters, onChange }: Props) {
  const hasActiveFilters =
    filters.cuisine || filters.priceLevel || filters.sort || filters.search;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск ресторана или блюда..."
          className="pl-9"
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={!filters.cuisine ? "secondary" : "outline"}
            size="sm"
            onClick={() => onChange({ ...filters, cuisine: undefined })}
          >
            Все кухни
          </Button>
          {cuisines.map((cuisine) => (
            <Button
              key={cuisine}
              variant={filters.cuisine === cuisine ? "secondary" : "outline"}
              size="sm"
              onClick={() =>
                onChange({
                  ...filters,
                  cuisine: filters.cuisine === cuisine ? undefined : cuisine,
                })
              }
            >
              {cuisine}
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Select
            items={PRICE_OPTIONS}
            value={filters.priceLevel ? String(filters.priceLevel) : null}
            onValueChange={(value) =>
              onChange({ ...filters, priceLevel: value ? Number(value) : undefined })
            }
          >
            <SelectTrigger className="w-36" size="sm">
              <SelectValue placeholder="Цена" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={SORT_OPTIONS}
            value={filters.sort ?? null}
            onValueChange={(value) =>
              onChange({ ...filters, sort: (value ?? undefined) as RestaurantFilters["sort"] })
            }
          >
            <SelectTrigger className="w-44" size="sm">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={() => onChange({})}>
              Сбросить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
