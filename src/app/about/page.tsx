import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About · Method — Leviathan Lens",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-10">
      <h1 className="font-serif text-4xl text-ink-900 tracking-tight">
        Why Leviathan Lens exists
      </h1>
      <p className="mt-4 text-lg text-ink-700 leading-relaxed">
        A rejection letter is a small, paper-shaped weapon. It arrives, it sits
        on the kitchen table, it says "unfortunately" — and most of the time,
        it wins. KFF's data on U.S. health insurance denials is brutal: fewer
        than 1% of denied claims are ever appealed, and of those, more than
        half are still upheld. The rest is silence. That silence is the
        product.
      </p>
      <p className="mt-4 text-lg text-ink-700 leading-relaxed">
        Cass Sunstein named the machinery behind that silence <em>sludge</em> —
        unjustified administrative friction that "hurts the most vulnerable
        members of society." The OECD's 2024 report <em>Fixing Frictions</em>
        formalised sludge auditing as a policy instrument that measures not
        just time and money, but <em>psychological cost</em>. Both frameworks
        are aimed at institutions. We aimed them at the letter in your hand.
      </p>
      <h2 className="mt-8 font-serif text-2xl text-ink-900">How the lens works</h2>
      <Card className="mt-3">
        <CardContent className="p-5 space-y-3 text-ink-700 leading-relaxed">
          <p>
            <strong>1. On-device taxonomy.</strong> Every paste is matched
            against ten named sludge tactics — vague denial, hidden deadline,
            reverse burden, obscured escalation, redundant document,
            intimidating legalese, passive blame-shift, dead-end contact,
            policy shield, time compression — each with signals, a rationale,
            and a counter-move.
          </p>
          <p>
            <strong>2. Jurisdiction detection.</strong> A lightweight classifier
            routes the letter into one of five domains (health insurance, visa,
            university, tenancy, benefit) and surfaces the right statute,
            ombudsperson, and deadline.
          </p>
          <p>
            <strong>3. LLM augmentation (optional).</strong> When you add a
            Claude Sonnet 4.5 or Gemini 2.5 Flash key in Settings, the same
            letter is also handed to the model with a strict JSON schema. Spans
            are verified to be verbatim substrings of the letter and reconciled
            against the deterministic pass — no hallucinated highlights.
          </p>
          <p>
            <strong>4. Response drafting.</strong> The reply quotes retrieved
            rights entries and maps each detected tactic to its counter-move,
            so the letter back doesn't just protest — it neutralises specific
            frictions the institution deployed.
          </p>
        </CardContent>
      </Card>

      <h2 className="mt-8 font-serif text-2xl text-ink-900">What this is not</h2>
      <p className="mt-3 text-ink-700 leading-relaxed">
        Not legal advice. Not a substitute for a lawyer, a caseworker, or a
        patient advocate. Every output is labelled 'draft — verify before
        sending' and we only cite rules retrieved from a small, curated corpus
        so the model cannot invent case law to dazzle you with.
      </p>

      <div className="mt-10 flex items-center justify-between rounded-lg border border-ink-200 bg-parchment-50 p-5">
        <div>
          <div className="font-serif text-xl text-ink-900">Ready to X-ray a letter?</div>
          <div className="text-sm text-ink-500">
            Bring the worst one in the drawer.
          </div>
        </div>
        <Link href="/">
          <Button>Open the Lens</Button>
        </Link>
      </div>
    </div>
  );
}
