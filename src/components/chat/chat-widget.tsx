"use client";

import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendChatMessage } from "@/lib/api-client";
import type { ChatMessage } from "@/types/domain";

/**
 * Floating AI assistant slot. The full recommendation logic belongs to the
 * AI Engineer's agent/backend; this widget already owns the UI, state, and
 * the `sendChatMessage` contract (see src/lib/api-client.ts +
 * src/types/api.ts#ApiChatRequest/ApiChatResponse) so wiring the real
 * assistant later is a backend change only.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Привет! Скоро я смогу подобрать ресторан под ваш вкус и бюджет.",
      createdAt: new Date().toISOString(),
    },
  ]);

  async function handleSend() {
    const text = input.trim();
    if (!text || pending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);
    try {
      const reply = await sendChatMessage({
        message: text,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((prev) => [...prev, reply]);
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        size="icon-lg"
        className="fixed bottom-5 right-5 z-50 rounded-full shadow-lg"
        aria-label="Открыть AI-помощника"
      >
        <Bot />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-xl border bg-popover shadow-xl">
      <div className="flex items-center justify-between border-b p-3">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <Bot className="size-4 text-primary" />
          AI-помощник
        </span>
        <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} aria-label="Закрыть">
          <X />
        </Button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                : "mr-auto max-w-[85%] rounded-lg bg-muted px-3 py-1.5 text-sm"
            }
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="mr-auto max-w-[85%] rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground">
            Печатает...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t p-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Спросите про ресторан..."
          className="h-8"
        />
        <Button size="icon-sm" onClick={handleSend} disabled={pending} aria-label="Отправить">
          <Send />
        </Button>
      </div>
    </div>
  );
}
