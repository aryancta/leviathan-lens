"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "warn" | "danger";
}

interface ToastCtx {
  toast: (t: Omit<ToastItem, "id">) => void;
}

const Ctx = React.createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const toast = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[340px]">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-md border px-4 py-3 shadow-lg animate-fade-up",
              t.tone === "success" && "border-green-700/30 bg-green-50 text-green-900",
              t.tone === "warn" && "border-amber-700/30 bg-amber-50 text-amber-900",
              t.tone === "danger" && "border-red-700/30 bg-red-50 text-red-900",
              (!t.tone || t.tone === "default") && "border-ink-200 bg-parchment-50 text-ink-900"
            )}
          >
            <div className="text-sm font-semibold">{t.title}</div>
            {t.description && <div className="text-xs mt-0.5 opacity-80">{t.description}</div>}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useToast outside ToastProvider");
  return ctx;
}
