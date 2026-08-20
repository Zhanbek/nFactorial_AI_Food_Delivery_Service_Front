# Role

Frontend Developer — Sarsenov Zhanbek. Owns UI, components, layout, and
client-side state for the food delivery web app (restaurant catalog, menu,
cart). Product: "Сервис выбора ресторанов / еды" (Almaty).

# System Rules

- The AI assistant generates UI through prompts; hand-written JSX/CSS is
  the exception, not the default. Every screen is built on a real design
  system (shadcn/ui + Tailwind), never raw HTML/CSS/JS or a bare
  button-and-text UI.
- No manual rewriting of AI-generated code to hide its origin — commits
  should reflect the actual AI-assisted workflow.
- Frontend never talks to the real backend directly from components.
  All data access goes through `src/lib/api-client.ts`, which returns
  typed domain models (`src/types/domain.ts`) built from mock data today
  and from the FastAPI service later — component code does not change
  when the swap happens.
- Backend contract assumption: FastAPI + Pydantic responses are
  snake_case; the raw shape lives in `src/types/api.ts` and is converted
  to camelCase domain types via `src/lib/mappers.ts`. If the real schema
  drifts from this assumption, update the DTO types and mappers only.
- Cart state is client-only (Zustand + localStorage) — no real payment or
  delivery is implemented; checkout is a simulated confirmation.
- The AI chat widget (`src/components/chat/chat-widget.tsx`) is UI/state
  only; response generation belongs to the AI Engineer's agent/backend.
- Nothing destructive (force-push, history rewrite, deleting teammates'
  work) without explicit confirmation from the team.

# MCP & Tools

- **Playwright MCP** — used to drive a real browser for manual QA of
  pages built this session (navigate, snapshot, screenshot).
- **Claude in Chrome** — fallback browser automation against the user's
  authenticated Chrome session (e.g. for reading assignment pages behind
  login) when Playwright's isolated context can't authenticate.
- GitHub MCP tooling available for repo/PR operations when needed.
- Minimum 1 MCP requirement for this role is satisfied by Playwright MCP.

# Subagents

Not used for this role in this session — work was done directly with
file/shell/browser tools rather than delegated to a subagent.

# Output Contracts

- **Domain types**: `src/types/domain.ts` (camelCase, UI-facing).
- **API DTOs**: `src/types/api.ts` (snake_case, mirrors FastAPI/Pydantic).
- **Components**: functional React (TSX), Tailwind utility classes,
  shadcn/ui primitives from `src/components/ui/*`.
- **State**: Zustand stores under `src/store/*`, persisted where the
  product requires it (e.g. cart).
- **Data access**: async functions in `src/lib/api-client.ts` only;
  never `fetch` calls inlined in components.
