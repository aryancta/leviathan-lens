"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Eye,
  FileText,
  Loader2,
  Scale,
  Scan,
  ShieldAlert,
  Sparkles,
  Upload,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SludgeXRay } from "@/components/SludgeXRay";
import { useToast } from "@/components/ui/toast";
import { SAMPLE_LETTERS, TOTAL_SEED_XRAYS } from "@/lib/seed";
import type { AnalysisResult } from "@/lib/analyze";
import { TACTIC_LIST } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const KEYS_LS = "leviathan_lens_api_keys";

function readKeys(): { anthropic?: string; gemini?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEYS_LS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function HomePage() {
  const { toast } = useToast();
  const [letter, setLetter] = React.useState<string>("");
  const [userName, setUserName] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [draft, setDraft] = React.useState<string>("");
  const [draftLoading, setDraftLoading] = React.useState(false);
  const [counter, setCounter] = React.useState<number>(TOTAL_SEED_XRAYS);
  const resultsRef = React.useRef<HTMLDivElement | null>(null);
  const formRef = React.useRef<HTMLDivElement | null>(null);

  const analyse = React.useCallback(
    async (text: string) => {
      if (!text.trim()) {
        toast({ title: "Paste a letter first", tone: "warn" });
        return;
      }
      setLoading(true);
      setResult(null);
      setDraft("");
      try {
        const keys = readKeys();
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(keys.anthropic ? { "x-user-anthropic-key": keys.anthropic } : {}),
            ...(keys.gemini ? { "x-user-gemini-key": keys.gemini } : {}),
          },
          body: JSON.stringify({ letter: text }),
        });
        if (!res.ok) throw new Error(`Analyse failed (${res.status})`);
        const data: AnalysisResult = await res.json();
        setResult(data);
        setCounter((c) => c + 1);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } catch (err) {
        console.error(err);
        toast({
          title: "Couldn't analyse that letter",
          description: err instanceof Error ? err.message : "Unknown error",
          tone: "danger",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const handleDraft = React.useCallback(async () => {
    if (!result) return;
    setDraftLoading(true);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ result, userName: userName || "[Your Name]" }),
      });
      if (!res.ok) throw new Error("Draft generation failed");
      const data: { draft: string } = await res.json();
      setDraft(data.draft);
      toast({ title: "Response drafted", tone: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Could not draft response", tone: "danger" });
    } finally {
      setDraftLoading(false);
    }
  }, [result, userName, toast]);

  const handleCopy = React.useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast({ title: `${label} copied`, tone: "success" });
      } catch {
        toast({ title: "Copy failed", tone: "danger" });
      }
    },
    [toast]
  );

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-10">
      {/* HERO */}
      <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-start">
        <div>
          <Badge className="mb-4 bg-parchment-200 text-ink-700 border-ink-200">
            <span className="h-1.5 w-1.5 rounded-full bg-sludge-red mr-1.5" />
            Sludge Audit Lens · v1
          </Badge>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink-900 md:text-6xl">
            Every rejection letter is <span className="italic">designed</span> to
            make you give up.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-600 leading-relaxed">
            Paste any denial letter — health insurance, visa, university,
            tenancy, benefits. In under a minute we translate it into plain
            English, X-ray the sludge tactics it uses against you, and draft the
            reply that pushes back.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={scrollToForm}>
              <Eye className="h-4 w-4" />
              Paste a letter
            </Button>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                <Scale className="h-4 w-4" />
                See the Collective Sludge Index
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-ink-700" />
              No login
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-ink-700" />
              Free
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-ink-700" />
              Works without any API key
            </span>
          </div>
        </div>

        {/* X-Ray demo preview */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-sans flex items-center gap-2">
                <Scan className="h-4 w-4 text-sludge-red" /> Sludge X-Ray
              </CardTitle>
              <div className="text-xs font-mono uppercase tracking-widest text-ink-500">
                live sample
              </div>
            </div>
          </CardHeader>
          <CardContent className="paper relative text-[13.5px] leading-[1.85] font-serif text-ink-900">
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-lg">
              <div className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-sludge-red/10 to-transparent animate-scan" />
            </div>
            <p>
              We regret to inform you that your claim{" "}
              <mark
                className="rounded-sm px-0.5"
                style={{ background: "#b4322c33", borderBottom: "2px solid #b4322c" }}
                title="Vague Denial Reason"
              >
                does not meet our criteria for medical necessity
              </mark>{" "}
              at this time.
            </p>
            <p className="mt-2">
              You must submit a written appeal{" "}
              <mark
                className="rounded-sm px-0.5"
                style={{ background: "#c9861f33", borderBottom: "2px solid #c9861f" }}
                title="Hidden Deadline"
              >
                within thirty (30) calendar days from the date of this letter
              </mark>
              . <mark
                className="rounded-sm px-0.5"
                style={{ background: "#3b4a7933", borderBottom: "2px solid #3b4a79" }}
                title="Reverse Burden of Proof"
              >
                The burden is on you to demonstrate
              </mark>{" "}
              that conservative treatment has been unsuccessful.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge tint="#b4322c">Vague Denial Reason</Badge>
              <Badge tint="#c9861f">Hidden Deadline</Badge>
              <Badge tint="#3b4a79">Reverse Burden of Proof</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* INTAKE */}
      <section ref={formRef} className="mt-16">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-serif text-3xl text-ink-900">Paste the letter.</h2>
            <p className="mt-1 text-ink-600 max-w-xl">
              Strip out names if you want — nothing you paste leaves your
              browser unless you add an API key in Settings.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-sludge-red"
              aria-hidden
            />
            {counter.toLocaleString()} letters X-rayed today
          </div>
        </div>

        <Card className="mt-5 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-[1fr_280px]">
              <div className="border-r border-ink-100 p-5">
                <Textarea
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  placeholder="Paste the letter here — or tap a sample to the right."
                  rows={14}
                  className="min-h-[340px] font-serif"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name (for the draft reply — optional)"
                    className="max-w-xs"
                  />
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload .txt</span>
                    <input
                      type="file"
                      accept=".txt,text/plain"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const text = await f.text();
                        setLetter(text);
                        toast({ title: "Letter loaded", tone: "default" });
                      }}
                    />
                  </label>
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setLetter("");
                        setResult(null);
                        setDraft("");
                      }}
                      disabled={!letter && !result}
                    >
                      Clear
                    </Button>
                    <Button
                      size="md"
                      onClick={() => analyse(letter)}
                      disabled={loading || !letter.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Scanning…
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4" /> Run Sludge X-Ray
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <aside className="bg-parchment-100/60 p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                  Try a sample
                </div>
                <ul className="mt-3 space-y-2">
                  {SAMPLE_LETTERS.map((s) => (
                    <li key={s.title}>
                      <button
                        className="w-full rounded-md border border-ink-200 bg-parchment-50 p-3 text-left transition hover:border-ink-400"
                        onClick={() => {
                          setLetter(s.text);
                          setResult(null);
                          setDraft("");
                          toast({ title: `Loaded: ${s.title}`, tone: "default" });
                        }}
                      >
                        <div className="text-sm font-medium text-ink-900">
                          {s.title}
                        </div>
                        <div className="text-xs text-ink-500 mt-0.5">
                          {s.subtitle}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-md border border-dashed border-ink-200 p-3 text-xs text-ink-500 leading-relaxed">
                  Leviathan Lens runs without any API key using an on-device
                  taxonomy.{" "}
                  <Link href="/settings" className="underline underline-offset-2">
                    Add a Claude or Gemini key
                  </Link>{" "}
                  for deeper reasoning.
                </div>
              </aside>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* RESULTS */}
      <section ref={resultsRef} className="mt-16">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-ink-200 bg-parchment-50 p-8"
            >
              <div className="flex items-center gap-3 text-ink-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <div>
                  <div className="font-serif text-lg">Running the lens…</div>
                  <div className="text-sm text-ink-500">
                    Matching phrases against the sludge taxonomy, pulling rights
                    for the jurisdiction, measuring friction.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Results
                result={result}
                userName={userName}
                draft={draft}
                draftLoading={draftLoading}
                onDraft={handleDraft}
                onCopy={handleCopy}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Feature trio */}
      <section className="mt-20 grid gap-5 md:grid-cols-3">
        <FeatureCard
          icon={<Eye className="h-5 w-5" />}
          title="Plain English"
          body="What the letter actually says, stripped of pursuant-to and hereinafter."
        />
        <FeatureCard
          icon={<Scan className="h-5 w-5" />}
          title="Sludge X-Ray"
          body="Named, highlighted, explained: ten friction patterns Sunstein's 'Sludge Audits' would flag."
        />
        <FeatureCard
          icon={<FileText className="h-5 w-5" />}
          title="Response draft"
          body="A letter back that neutralises the tactics, cites the right body, and sounds like you wrote it."
        />
      </section>

      {/* Tactic taxonomy preview */}
      <section className="mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ink-900">
              The ten sludge tactics we look for
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Derived from Sunstein's sludge-audit framework and OECD's 2024
              report on administrative friction.
            </p>
          </div>
          <Link
            href="/taxonomy"
            className="text-sm text-ink-700 hover:text-ink-900 inline-flex items-center gap-1"
          >
            Full taxonomy <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {TACTIC_LIST.map((t) => (
            <div
              key={t.id}
              className="rounded-md border border-ink-200 bg-parchment-50 p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: t.color }}
                />
                <div className="text-sm font-medium text-ink-900">{t.name}</div>
              </div>
              <div className="mt-1.5 text-xs text-ink-500 leading-snug">
                {t.oneLiner}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-ink-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-900 text-parchment-50">
            {icon}
          </span>
          <div className="font-serif text-lg">{title}</div>
        </div>
        <p className="mt-2 text-sm text-ink-600 leading-relaxed">{body}</p>
      </CardContent>
    </Card>
  );
}

function Results({
  result,
  userName,
  draft,
  draftLoading,
  onDraft,
  onCopy,
}: {
  result: AnalysisResult;
  userName: string;
  draft: string;
  draftLoading: boolean;
  onDraft: () => void;
  onCopy: (text: string, label: string) => void;
}) {
  return (
    <>
      {/* Score + plain English */}
      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                  Sludge score
                </div>
                <div className="font-serif text-5xl text-ink-900 mt-1">
                  {result.sludgeScore}
                  <span className="text-ink-400 text-2xl">/100</span>
                </div>
              </div>
              <ShieldAlert className="h-7 w-7 text-sludge-red" />
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-parchment-200 overflow-hidden">
              <div
                className="h-full bg-sludge-red transition-all"
                style={{ width: `${result.sludgeScore}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-ink-600">
              {result.spans.length} friction phrases across{" "}
              {result.tacticCounts.length} tactic{result.tacticCounts.length === 1 ? "" : "s"}.
              {result.institution && (
                <>
                  {" "}
                  Institution inferred: <span className="font-medium">{result.institution}</span>.
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-sans">
              <Sparkles className="h-4 w-4" /> Plain English
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[15px] leading-relaxed text-ink-800">
            <p>
              <span className="font-semibold text-ink-900">What it really says: </span>
              {result.plainEnglish.whatItSays}
            </p>
            <p>
              <span className="font-semibold text-ink-900">
                What happens if you do nothing:{" "}
              </span>
              {result.plainEnglish.whatHappensIfYouDoNothing}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tactic chips */}
      {result.tacticCounts.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-2">
            Tactics detected
          </div>
          <div className="flex flex-wrap gap-2">
            {result.tacticCounts.map((t) => (
              <Badge key={t.id} tint={t.color} title={t.oneLiner}>
                {t.name} · {t.count}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* X-Ray */}
      <SludgeXRay result={result} />

      {/* Rights map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-sans">
            <Scale className="h-4 w-4" /> Your rights &amp; escalation map
            <span className="ml-2 text-xs text-ink-500 font-normal">
              ({result.domain.replace("_", " ")})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {result.rights.map((r) => (
            <div
              key={r.title}
              className="rounded-md border border-ink-200 bg-parchment-50 p-4"
            >
              <div className="flex items-center gap-2">
                <Badge className="bg-ink-900 text-parchment-50 border-ink-900">
                  {r.jurisdiction}
                </Badge>
                <div className="font-serif text-[15px] text-ink-900">
                  {r.title}
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">
                {r.summary}
              </p>
              {r.deadline && (
                <p className="mt-2 text-sm text-ink-800">
                  <span className="font-medium">Deadline:</span> {r.deadline}
                </p>
              )}
              {r.body && (
                <p className="mt-1 text-sm text-ink-800">
                  <span className="font-medium">Escalate to:</span> {r.body}
                </p>
              )}
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-ink-700 hover:text-ink-900"
              >
                Open source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Deadlines */}
      {result.deadlines.length > 0 && (
        <Card>
          <CardContent className="p-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-sludge-amber shrink-0 mt-0.5" />
            <div>
              <div className="font-serif text-lg text-ink-900">
                Deadlines buried in the letter
              </div>
              <ul className="mt-1 list-disc pl-5 text-sm text-ink-700 space-y-0.5">
                {result.deadlines.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-500">
                File a short 'notice of intent to appeal' before this expires,
                even if your full submission follows later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Draft */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2 text-base font-sans">
              <FileText className="h-4 w-4" /> Draft response
            </CardTitle>
            <div className="flex items-center gap-2">
              {draft && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopy(draft, "Draft")}
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              )}
              <Button size="sm" onClick={onDraft} disabled={draftLoading}>
                {draftLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Drafting…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    {draft ? "Regenerate" : "Draft response"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {draft ? (
            <DraftEditor initial={draft} />
          ) : (
            <div className="rounded-md border border-dashed border-ink-300 bg-parchment-100/60 p-6 text-center">
              <p className="text-ink-600">
                Click <span className="font-medium">Draft response</span> to
                generate a tailored reply that quotes the right rule, names the
                escalation body, and neutralises each sludge tactic above.
              </p>
            </div>
          )}
          {draft && (
            <p className="mt-2 text-xs text-ink-500">
              Draft only. Review carefully, insert the original letter date,
              and verify citations before sending.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function DraftEditor({ initial }: { initial: string }) {
  const [value, setValue] = React.useState(initial);
  React.useEffect(() => setValue(initial), [initial]);
  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="min-h-[420px] font-serif"
      aria-label="Draft response letter"
    />
  );
}
