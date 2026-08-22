# Role (Frontend)

Frontend Developer — Sarsenov Zhanbek. Owns UI, components, layout, and
client-side state for the food delivery web app (restaurant catalog, menu,
cart). Product: "Сервис выбора ресторанов / еды" (Almaty), project #4 from
the assignment's project list — must work as a normal food catalog with the
cart/checkout flow even with the AI chat widget disabled; the chat only
augments it (helps pick a restaurant, suggests dishes, considers budget and
preferences), per the assignment's "Главное правило для всех проектов".

# System Rules

**Роль AI**
- The AI assistant is the primary author of UI code: it generates
  components, layout, and state management through prompts. Hand-written
  JSX/CSS is the exception, not the default.
- The AI is also used as a QA/debugging partner within this role — driving
  a real browser (Playwright MCP) to find and verify bugs in the running
  app, not just to write code blind.

**Ограничения**
- Every screen is built on a real design system (shadcn/ui + Tailwind),
  never raw HTML/CSS/JS or a bare button-and-text UI.
- Frontend never talks to the real backend directly from components. All
  data access goes through `src/lib/api-client.ts`, which returns typed
  domain models (`src/types/domain.ts`) built from mock data today and from
  the FastAPI service later — component code does not change when the swap
  happens (only `NEXT_PUBLIC_API_BASE_URL`).
- Backend contract assumption: FastAPI + Pydantic responses are snake_case;
  the raw shape lives in `src/types/api.ts` and is converted to camelCase
  domain types via `src/lib/mappers.ts`. If the real schema drifts from
  this assumption, update the DTO types and mappers only.
- Cart state is client-only (Zustand + localStorage) — no real payment or
  delivery is implemented; checkout is a simulated confirmation.
- The AI chat widget (`src/components/chat/chat-widget.tsx`) is UI/state
  only; response generation (recommendations, budget/preference reasoning)
  belongs to the AI Engineer's agent/backend, called through
  `sendChatMessage` in `src/lib/api-client.ts`.

**Чего делать нельзя**
- No manual rewriting of AI-generated code to hide its origin — commits
  must reflect the actual AI-assisted workflow (anti-pattern: "ручное
  переписывание AI-кода" costs Workflow points).
- No commits after 20:30 seminar cutoff — repository state at 20:30 is
  what gets graded.
- Nothing destructive (force-push, history rewrite, deleting teammates'
  work) without explicit confirmation from the team.
- No inventing backend/AI behavior client-side to paper over a missing
  feature — if the chat or an endpoint isn't ready, the widget shows its
  real (stub) state instead of a fake success.

**Формат ответов**
- User-facing replies in this project are in Russian, short, and lead with
  the result (what changed / what the test showed), not a narration of
  every tool call.
- Code changes ship with a to-the-point summary: what was broken, what was
  fixed, how it was verified (`tsc`, `eslint`, `vitest`, browser check).
- Bug reports from QA passes include exact repro steps (request/response
  payloads, or the precise UI action sequence) so they're directly
  actionable by whoever owns that layer (frontend, backend, or AI).

# MCP & Tools

**Какие MCP подключены**
- **Playwright MCP** — primary MCP for this role; drives a real, isolated
  browser to navigate the app, take accessibility snapshots, fill forms,
  and read console/network output. Used throughout the session for manual
  QA: catalog filters, search, restaurant detail pages, cart, checkout,
  and the AI chat widget end-to-end against both mock data and the real
  backend once wired up.
- **Claude in Chrome** — fallback browser automation against the user's
  authenticated Chrome session for pages an isolated Playwright context
  can't reach (e.g. assignment pages behind login). Attempted this session
  for the Notion assignment page; the extension wasn't connected, so
  Playwright MCP was used against the public Notion link instead —
  real external context was still pulled in, just through the other tool.
- GitHub MCP tooling available for repo/PR operations when needed.
- Minimum-1-MCP requirement for this role is satisfied (and exceeded in
  practice — Playwright MCP was used dozens of times this session, not
  just once) by Playwright MCP.

**Какие tools может вызывать AI**
- File tools (Read/Edit/Write) for component, store, and config changes.
- Bash/PowerShell for `tsc`, `eslint`, `vitest`, `next build`, process
  management (starting/restarting the dev server and, during backend
  integration testing, the FastAPI server on its assigned port).
- `WebFetch` for reading documentation/spec pages when a plain HTTP fetch
  is enough; Playwright MCP when the page needs real JS rendering (as with
  the Notion assignment page above).
- `AskUserQuestion` when a decision is the user's to make (e.g. which pull
  strategy to use before a `git push`) rather than guessed.

# Subagents

**Назначение**: not used for this role this session.

**Когда вызываются**: n/a — work was done directly with file/shell/browser
tools rather than delegated to a subagent. If a future task needs broad,
open-ended codebase exploration, the `Explore` general-purpose agent is the
candidate rather than hand-rolling multi-step search.

# Output Contracts

- **Domain types**: `src/types/domain.ts` (camelCase, UI-facing).
- **API DTOs**: `src/types/api.ts` (snake_case, mirrors FastAPI/Pydantic).
- **Components (JSX/TSX)**: functional React (TSX), Tailwind utility
  classes, shadcn/ui primitives from `src/components/ui/*`.
- **State**: Zustand stores under `src/store/*`, persisted where the
  product requires it (e.g. cart), with SSR-safe hydration guards
  (`useSyncExternalStore`) for anything read from `localStorage`.
- **Data access**: async functions in `src/lib/api-client.ts` only; never
  `fetch` calls inlined in components.
- **Tests**: Vitest + Testing Library specs alongside the code they cover
  (e.g. `src/store/cart-store.test.ts`); `npm run test` / `vitest run` must
  pass before a change is considered done, satisfying the project's
  Definition-of-Done "Есть автотесты" checkbox.
