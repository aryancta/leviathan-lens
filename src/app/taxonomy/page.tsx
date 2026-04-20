import Link from "next/link";
import { TACTIC_LIST } from "@/lib/taxonomy";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Sludge tactic taxonomy — Leviathan Lens",
};

export default function TaxonomyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Link>
      <h1 className="mt-3 font-serif text-4xl text-ink-900 tracking-tight">
        The sludge tactic taxonomy
      </h1>
      <p className="mt-3 text-ink-600 max-w-2xl">
        The lens scans every pasted letter for these ten patterns. Each one is
        a specific, documented friction device — named, evidenced, and
        counter-moveable. Inspired by Cass Sunstein's <em>Sludge Audits</em> and
        the OECD's 2024 report on administrative friction.
      </p>
      <div className="mt-8 grid gap-4">
        {TACTIC_LIST.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-2xl text-ink-900 flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: t.color }}
                  />
                  {t.name}
                </h2>
                <Badge tint={t.color}>{t.id}</Badge>
              </div>
              <p className="mt-2 text-ink-700 leading-relaxed">{t.oneLiner}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-[1.1fr_1fr]">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                    Why this friction exists
                  </div>
                  <p className="mt-1 text-sm text-ink-700 leading-relaxed">{t.why}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                    How to counter it
                  </div>
                  <p className="mt-1 text-sm text-ink-700 leading-relaxed">{t.counterMove}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-ink-500">
                <span className="font-semibold uppercase tracking-widest mr-1">Signals</span>
                <span className="font-mono">{t.signals.slice(0, 4).join(" · ")}</span>
                {t.signals.length > 4 && <span> · +{t.signals.length - 4} more</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 flex items-center justify-between rounded-lg border border-ink-200 bg-parchment-50 p-5">
        <div>
          <div className="font-serif text-xl text-ink-900">Put the taxonomy to work.</div>
          <div className="text-sm text-ink-500">Paste a letter, see which of the ten it's running.</div>
        </div>
        <Link href="/">
          <Button>Open the Lens</Button>
        </Link>
      </div>
    </div>
  );
}
