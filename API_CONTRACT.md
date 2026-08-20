# REST API Contract (Frontend ⇄ Backend)

Этот файл — контракт между фронтендом (Next.js) и бэкендом (FastAPI +
SQLAlchemy). Фронтенд уже реализован под эту схему и сейчас работает на
моках (`src/lib/mock-data.ts`) через единый клиент `src/lib/api-client.ts`.
Как только бэкенд поднят, во фронтенде нужно только выставить переменную
окружения `NEXT_PUBLIC_API_BASE_URL` — код компонентов менять не придётся.

Формат ответов — **snake_case**, как отдаёт FastAPI/Pydantic по
умолчанию (без `alias_generator`). Если бэкенд решит отдавать camelCase —
сообщите заранее, тогда правится только `src/types/api.ts` +
`src/lib/mappers.ts`.

Схема ниже соответствует типам в `src/types/api.ts` — при расхождениях
источником истины считать этот файл + тот файл типов.

---

## Базовый URL

```
{NEXT_PUBLIC_API_BASE_URL}/api/v1
```

Swagger/OpenAPI ожидается по стандартному пути FastAPI: `/docs` и
`/openapi.json`.

---

## 1. `GET /restaurants`

Список ресторанов с фильтрами.

**Query params** (все опциональны):

| Параметр      | Тип                                          | Пример   |
|---------------|-----------------------------------------------|----------|
| `city`        | string                                        | `Алматы` |
| `cuisine`     | string (один из `cuisine_types` ресторана)    | `Пицца`  |
| `price_level` | int, 1–3                                      | `2`      |
| `min_rating`  | float                                         | `4.5`    |
| `search`      | string (поиск по названию/описанию)           | `суши`   |
| `sort`        | `rating` \| `delivery_time` \| `delivery_fee` | `rating` |

**Response 200** — `ApiRestaurant[]`:

```json
[
  {
    "id": 1,
    "slug": "dastarkhan-almaty",
    "name": "Дастархан",
    "description": "Традиционная казахская кухня...",
    "cuisine_types": ["Казахская"],
    "city": "Алматы",
    "address": "ул. Достык, 91",
    "rating": 4.8,
    "rating_count": 612,
    "price_level": 2,
    "delivery_time_min": 30,
    "delivery_time_max": 45,
    "delivery_fee": 500,
    "min_order_amount": 3000,
    "image_url": "https://.../dastarkhan.jpg",
    "is_open": true,
    "tags": ["Популярно", "Нац. кухня"]
  }
]
```

## 2. `GET /restaurants/{slug}`

Детальная карточка ресторана + меню.

**Response 200** — `ApiRestaurantDetail` (= `ApiRestaurant` + категории и
позиции меню):

```json
{
  "id": 1,
  "slug": "dastarkhan-almaty",
  "...": "...остальные поля как в ApiRestaurant",
  "categories": [
    { "id": 11, "restaurant_id": 1, "name": "Стартеры", "sort_order": 0 },
    { "id": 12, "restaurant_id": 1, "name": "Основные блюда", "sort_order": 1 }
  ],
  "menu_items": [
    {
      "id": 101,
      "restaurant_id": 1,
      "category_id": 12,
      "name": "Бешбармак с кониной",
      "description": "Традиционное блюдо с домашней лапшой",
      "price": 3800,
      "image_url": "https://.../item.jpg",
      "is_available": true,
      "tags": []
    }
  ]
}
```

**Response 404** — ресторан со слагом не найден (тело не критично,
фронтенд просто проверяет статус).

## 3. `GET /cuisines`

Список всех уникальных типов кухни — используется для чипов-фильтров на
главной странице.

**Response 200**:

```json
["Азиатская", "Американская", "Вегетарианская", "Грузинская", "Итальянская", "Казахская", "Кофе и десерты", "Пицца", "Суши", "Японская"]
```

## 4. `POST /orders`

Оформление заказа. **Оплата не выполняется** — это демо-чекаут
("заказ" сразу переходит в статус `confirmed`).

**Request body** — `ApiOrderPayload`:

```json
{
  "restaurant_id": 1,
  "items": [
    { "menu_item_id": 101, "quantity": 2 },
    { "menu_item_id": 103, "quantity": 1 }
  ],
  "comment": "Без лука, домофон не работает"
}
```

**Response 200/201** — `ApiOrderConfirmation`:

```json
{
  "id": 4821,
  "status": "confirmed",
  "total": 8600,
  "estimated_delivery_min": 35
}
```

Сервер должен сам посчитать `total` по актуальным ценам позиций (не
доверять цене с фронтенда).

## 5. `POST /chat` (зарезервировано для AI Engineer)

Фронтенд уже вызывает этот эндпоинт из виджета AI-помощника
(`src/components/chat/chat-widget.tsx`) и до его готовности получает
заглушку. Реализация — зона AI Engineer, но контракт фиксируем сейчас,
чтобы фронтенду не пришлось ничего менять.

**Request body** — `ApiChatRequest`:

```json
{
  "message": "Посоветуй что-то бюджетное и острое",
  "restaurant_id": null,
  "budget": 3000,
  "preferences": ["острое", "азиатская кухня"],
  "history": [
    { "role": "user", "content": "Привет" },
    { "role": "assistant", "content": "Привет! Чем помочь?" }
  ]
}
```

**Response 200** — `ApiChatResponse`:

```json
{
  "reply": "Рекомендую Wok Street — острый вок с говядиной за 2900 ₸.",
  "suggested_restaurant_ids": [8]
}
```

---

## Общие правила

- Все денежные суммы — целые числа в тенге (без копеек), как в моках.
- `price_level`: 1 = `$`, 2 = `$$`, 3 = `$$$`.
- Ошибки — стандартный FastAPI формат `{"detail": "..."}`, фронтенд сейчас
  проверяет только `res.ok`/`res.status`, детальный парсинг ошибок можно
  добавить по мере необходимости.
- CORS: бэкенду нужно разрешить origin фронтенда (dev: `http://localhost:3000`,
  прод: домен деплоя на Vercel/Netlify).
