# Leviathan Lens

> Paste any rejection letter. See the sludge. Fight back in 60 seconds.

![Leviathan Lens — Sludge X-Ray](./public/hero.svg)

Leviathan Lens is a **sludge-audit lens** for the letters that quietly break people: insurance denials, visa refusals, university grievance dismissals, eviction notices, benefits rejections. You paste the letter; we translate it into plain English, highlight every friction tactic it is running against you, map the exact rights, deadlines, and escalation bodies that apply, and draft the reply that pushes back.

It is the first AI tool that treats a denial letter as a **decodable artefact of bureaucratic sludge** — not just a thing to appeal, but a thing to *read back to the system that wrote it*.

## Why this, why now

Cass Sunstein formalised the problem in *Sludge: What Stops Us From Getting Things Done* — unjustified administrative friction that disproportionately hurts the most vulnerable. The OECD's 2024 report *Fixing Frictions* turned sludge auditing into a policy instrument that measures not just time and money but the *psychological cost* of the friction. Existing AI-appeal tools (Counterforce Health, Claimable, Fight Health Insurance) are narrow — US-only, health-insurance-only, letter-out-only. None of them **visualise the friction itself**.

Leviathan Lens does both halves of the hackathon thesis:

- **Fix**: plain-English translation, rights map, and a one-click response draft neutralising the specific tactics in the letter.
- **Mirror**: a named, animated Sludge X-Ray + a Collective Sludge Index showing which institutions deploy which tactics, at what rate.

## 60-second demo flow

1. Land on the Lens. Paste a real denial letter (or click one of the three seeded samples: US health insurance, UK visa, India university grievance).
2. Hit **Run Sludge X-Ray**. In ~two seconds, phrases in the letter highlight themselves with named tactics: *Vague Denial Reason*, *Hidden Deadline*, *Reverse Burden of Proof*, *Policy Shield*, seven more.
3. Scroll down: plain English translation, a rights-and-escalation map tuned to the detected jurisdiction, and any deadlines buried in the letter surfaced in plain sight.
4. Click **Draft response**. A tailored reply appears — quoting the right ombudsperson, asking for the specific clause, and answering each detected tactic with its counter-move.
5. Visit `/dashboard` to see the **Collective Sludge Index**: which tactics which institutions use, how often.

## Architecture

![Architecture](./public/architecture.svg)

- **Next.js 14** App Router, TypeScript, standalone build (Docker-friendly).
- **Local sludge engine** — `src/lib/analyze.ts` — a deterministic ten-tactic taxonomy with verbatim span matching and a jurisdiction detector. The product is fully usable without any API key.
- **LLM augmentation** — `src/lib/llm.ts` — when a Claude Sonnet 4.5 or Gemini 2.5 Flash key is present in Settings, the same letter is also sent to the model with a strict JSON schema. Spans are verified to be verbatim substrings of the letter; anything the model paraphrases is dropped. The richer of the two span sets (local vs. LLM) wins the merge.
- **Rights corpus** — `src/lib/rights.ts` — a small, curated set of statute/ombudsperson entries across five domains (health insurance, visa, university, tenancy, government benefit) plus a generic fallback. Retrieval is domain-routed by a lightweight classifier.
- **Taxonomy** — `src/lib/taxonomy.ts` — ten named sludge tactics, each with signals, a rationale, a counter-move, and a colour for the X-Ray overlay.
- **UI** — Tailwind + shadcn-style primitives we wrote in `src/components/ui`, Framer Motion for the staggered X-Ray reveal, Lucide icons, a paper/ink palette so the product reads as a serious document rather than a chatbot.
- **Keys never touch the server filesystem.** They are stored in `localStorage` under `leviathan_lens_api_keys` and forwarded per-request as `x-user-anthropic-key` / `x-user-gemini-key` headers. The server never logs them; it never persists them.

## Routes

| Route | Description |
|---|---|
| `/` | Paste intake, Sludge X-Ray, plain English, rights map, draft response |
| `/dashboard` | Collective Sludge Index — per-institution tactic frequencies |
| `/taxonomy` | Full reference of the ten sludge tactics with signals and counter-moves |
| `/about` | Method: how the lens works, what it isn't |
| `/settings` | Bring-your-own-key panel (Claude + Gemini), stored only in localStorage |

## Run it

### Docker (the canonical way)

```bash
docker build -t app .
docker run -p 3000:3000 app
```

Then open http://localhost:3000.

### Locally with Node

```bash
npm install
npm run dev
```

No environment variables are required. The app ships with a deterministic local engine, three seeded sample letters, and eight seeded institutions in the Collective Sludge Index so the product is never empty.

### Adding API keys (optional)

1. Open http://localhost:3000/settings
2. Paste a Claude Sonnet 4.5 or Gemini 2.5 Flash key — get them free at [console.anthropic.com](https://console.anthropic.com/) and [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
3. Keys live in your browser's `localStorage`. Clear them any time from the same page.

## Tech stack

- **Next.js 14** (App Router, standalone output) · **TypeScript** · **Tailwind CSS**
- **Framer Motion** for the X-Ray stagger-reveal · **Lucide** icons · shadcn-style primitives
- **Anthropic Claude Sonnet 4.5** (primary reasoning) · **Google Gemini 2.5 Flash** (fallback + multimodal)
- **Docker** (Node 20 Alpine, multi-stage build, non-root runtime user)

## Safety stance

- Every draft response is explicitly labelled *draft — verify citations before sending*.
- Citations come only from the curated rights corpus — the model cannot invent case law.
- LLM spans are dropped unless they are verbatim substrings of the original letter.
- No letter text is ever persisted; the Collective Sludge Index aggregates anonymised tactic counts only.

## Credits

Built for the **LEVIATHAN Hackathon [AXI0M × Lovable]** by Aryan Choudhary (aryancta@gmail.com).

Theoretical spine: Cass Sunstein, *Sludge Audits* (Behavioural Public Policy) and OECD, *Fixing Frictions: Sludge Audits Around the World* (2024). Market context: KFF / NBC News coverage of AI-vs-AI insurance appeals; Counterforce Health, Claimable, Fight Health Insurance as the narrow, US-only prior art we are the super-set of.

Output is informational. Not legal advice.
