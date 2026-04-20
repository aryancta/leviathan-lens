"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Eye, Settings, BarChart3 } from "lucide-react";

const nav = [
  { href: "/", label: "Lens", icon: Eye },
  { href: "/dashboard", label: "Sludge Index", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-parchment-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            aria-hidden
            className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ink-900"
          >
            <span className="absolute inset-1 rounded-full border border-parchment-50/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-parchment-50" />
          </span>
          <span className="font-serif text-lg tracking-tight text-ink-900">
            Leviathan <span className="italic text-ink-600">Lens</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-ink-900 text-parchment-50"
                    : "text-ink-700 hover:bg-parchment-200"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
