"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEED_INSTITUTIONS, TOTAL_SEED_XRAYS, type InstitutionRecord } from "@/lib/seed";
import { TACTICS, TACTIC_LIST } from "@/lib/taxonomy";
import { formatNumber } from "@/lib/utils";
import { ArrowRight, Building2, Filter } from "lucide-react";

const SECTOR_LABEL: Record<InstitutionRecord["sector"], string> = {
  health: "Health insurance",
  visa: "Visa & immigration",
  university: "University",
  tenancy: "Tenancy",
  benefit: "Government benefit",
};

export default function DashboardPage() {
  const [filter, setFilter] = React.useState<"all" | InstitutionRecord["sector"]>("all");
  const visible = SEED_INSTITUTIONS.filter((i) => filter === "all" || i.sector === filter).sort(
    (a, b) => b.xrays - a.xrays
  );

  const tacticTotals = React.useMemo(() => {
    const acc: Record<string, number> = {};
    for (const inst of SEED_INSTITUTIONS) {
      for (const t of inst.topTactics) {
        acc[t.tacticId] = (acc[t.tacticId] ?? 0) + Math.round(t.frequency * inst.xrays);
      }
    }
    return Object.entries(acc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-10">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink-900 tracking-tight">
            Collective Sludge Index
          </h1>
          <p className="mt-2 text-ink-600 max-w-2xl">
            Every X-ray contributes an anonymised tactic count to a shared
            ledger. Individual pain becomes a pattern — one regulators and
            journalists can read. No letter text is ever stored.
          </p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-parchment-50 px-5 py-3 text-right">
          <div className="text-xs font-semibold uppercase tracking-widest text-ink-500">
            Letters X-rayed
          </div>
          <div className="font-serif text-3xl text-ink-900">
            {formatNumber(TOTAL_SEED_XRAYS)}
          </div>
          <div className="text-xs text-ink-500">
            across {SEED_INSTITUTIONS.length} institutions · live
          </div>
        </div>
      </div>

      {/* Top tactic bars */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base font-sans">
            Top tactics across the index
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tacticTotals.map(([id, count]) => {
            const tactic = TACTICS[id as keyof typeof TACTICS];
            const max = tacticTotals[0][1];
            return (
              <div key={id}>
                <div className="flex items-baseline justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: tactic.color }}
                    />
                    <span className="font-medium text-ink-900">
                      {tactic.name}
                    </span>
                  </div>
                  <span className="font-mono text-ink-500 text-xs">
                    {formatNumber(count)} flags
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-parchment-200">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(count / max) * 100}%`,
                      background: tactic.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Filter row */}
      <div className="mt-10 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-ink-500 mr-2">
          <Filter className="h-3.5 w-3.5" /> Sector:
        </div>
        {(["all", "health", "visa", "university", "tenancy", "benefit"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              filter === s
                ? "bg-ink-900 text-parchment-50 border-ink-900"
                : "border-ink-200 bg-parchment-50 text-ink-700 hover:border-ink-400"
            }`}
          >
            {s === "all" ? "All" : SECTOR_LABEL[s]}
          </button>
        ))}
      </div>

      {/* Institutions grid */}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {visible.map((inst) => (
          <Card key={inst.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-ink-500" />
                    <h3 className="font-serif text-xl text-ink-900">
                      {inst.name}
                    </h3>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                    <Badge>{inst.jurisdiction}</Badge>
                    <span>·</span>
                    <span>{SECTOR_LABEL[inst.sector]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-2xl text-ink-900">
                    {formatNumber(inst.xrays)}
                  </div>
                  <div className="text-xs text-ink-500">letters x-rayed</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {inst.topTactics.map((t) => {
                  const tactic = TACTICS[t.tacticId];
                  const pct = Math.round(t.frequency * 100);
                  return (
                    <div key={t.tacticId}>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-ink-700">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: tactic.color }}
                          />
                          {tactic.name}
                        </span>
                        <span className="font-mono text-ink-500">{pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-parchment-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: tactic.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-ink-500">
                Last X-ray: {inst.lastSeen}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tactic legend */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-base font-sans">Tactic legend</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TACTIC_LIST.map((t) => (
            <div key={t.id} className="flex items-start gap-2">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                style={{ background: t.color }}
              />
              <div>
                <div className="text-sm font-medium text-ink-900">{t.name}</div>
                <div className="text-xs text-ink-500">{t.oneLiner}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-10 flex items-center justify-between rounded-lg border border-ink-200 bg-parchment-50 p-5">
        <div>
          <div className="font-serif text-xl text-ink-900">
            Got a letter to add to the index?
          </div>
          <div className="text-sm text-ink-500">
            Paste it. 30 seconds later, the world sees one more pattern.
          </div>
        </div>
        <Link href="/">
          <Button>
            Run Sludge X-Ray <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
