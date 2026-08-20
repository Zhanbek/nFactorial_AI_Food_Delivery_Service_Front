# FoodGo Almaty — Frontend

Фронтенд сервиса доставки еды (аналог Glovo / Яндекс Еда) для города
Алматы: каталог ресторанов с фильтрами, меню, корзина и заготовка под
AI-помощника по подбору блюд.

Часть группового проекта nFactorial (роль **Frontend Developer**). Бэкенд
(FastAPI) разрабатывается отдельно — контракт между сервисами описан в
[`API_CONTRACT.md`](./API_CONTRACT.md).

## Стек

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com) (design system)
- [Zustand](https://github.com/pmndrs/zustand) — состояние корзины (persist в localStorage)
- Vitest + Testing Library — автотесты

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

По умолчанию используются mock-данные (`src/lib/mock-data.ts`) — никакого
бэкенда для запуска не требуется. Чтобы переключиться на реальный API,
задайте переменную окружения:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

и перезапустите dev-сервер — код компонентов менять не нужно, вся логика
переключения инкапсулирована в `src/lib/api-client.ts`.

## Структура

```
src/
  app/                    # страницы (App Router)
    page.tsx              # каталог ресторанов + фильтры
    restaurants/[slug]/   # страница ресторана + меню
    cart/                 # корзина и оформление заказа
  components/
    ui/                   # shadcn/ui примитивы
    restaurants/          # карточка ресторана, фильтры
    menu/                 # карточка блюда
    cart/                 # мини-корзина (Sheet)
    chat/                 # заготовка AI-виджета
    layout/                # header
  lib/
    api-client.ts         # единая точка доступа к данным (mock ⇄ реальный API)
    mappers.ts             # snake_case (API) -> camelCase (domain)
    mock-data.ts            # моковые рестораны/меню (Алматы)
    format.ts                # форматирование цены/рейтинга
  store/
    cart-store.ts           # Zustand-стор корзины
  types/
    api.ts                  # DTO под FastAPI/Pydantic (snake_case)
    domain.ts                 # модели для UI (camelCase)
ai-rules/
  Frontend_Sarsenov.md      # обязательный ai-rules файл роли Frontend
API_CONTRACT.md              # REST-контракт для бэкенд-разработчика
```

## Тесты

```bash
npm run test
```

## Деплой

Проект готов к деплою на Vercel как обычное Next.js-приложение (не
забудьте выставить `NEXT_PUBLIC_API_BASE_URL` в переменных окружения
проекта, когда бэкенд будет задеплоен).
