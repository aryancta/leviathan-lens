import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TACTIC_LIST, type TacticId } from "./taxonomy";
import { localAnalyze, type AnalysisResult, type Span } from "./analyze";

const SYSTEM_PROMPT = `You are Leviathan Lens, an expert in administrative-law "sludge" analysis (Sunstein, OECD 2024).
You read a rejection/denial letter and return a JSON object strictly matching this TypeScript type:

type Analysis = {
  plainEnglish: { whatItSays: string; whatHappensIfYouDoNothing: string };
  spans: Array<{ quote: string; tacticId: "vague_denial"|"hidden_deadline"|"reverse_burden"|"obscured_escalation"|"redundant_document"|"intimidating_legalese"|"passive_blame"|"dead_end_contact"|"policy_shield"|"time_compression"; explain: string }>;
  deadlines: string[];
  institution: string | null;
};

Rules:
- "quote" MUST be a VERBATIM substring of the letter, 4-200 characters, copied exactly (no summarizing).
- Pick tactics from the enum above only. One quote per span; do not overlap.
- plainEnglish must be in simple English, max 2 short sentences per field.
- Do not invent legal citations. Only describe what the letter itself does.
- Return JSON ONLY. No prose, no markdown fences.`;

export interface LLMKeys {
  anthropic?: string;
  gemini?: string;
}

function cleanJson(raw: string): string {
  let t = raw.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
  }
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1) t = t.slice(start, end + 1);
  return t;
}

function normalizeSpans(letter: string, raw: Array<{ quote: string; tacticId: string; explain?: string }>): Span[] {
  const validIds = new Set(TACTIC_LIST.map((t) => t.id));
  const out: Span[] = [];
  for (const s of raw) {
    if (!s?.quote || !s?.tacticId) continue;
    if (!validIds.has(s.tacticId as TacticId)) continue;
    const idx = letter.indexOf(s.quote);
    if (idx === -1) {
      const lower = letter.toLowerCase().indexOf(s.quote.toLowerCase());
      if (lower === -1) continue;
      out.push({
        start: lower,
        end: lower + s.quote.length,
        tacticId: s.tacticId as TacticId,
        quote: letter.slice(lower, lower + s.quote.length),
        explain: s.explain ?? "",
      });
    } else {
      out.push({
        start: idx,
        end: idx + s.quote.length,
        tacticId: s.tacticId as TacticId,
        quote: s.quote,
        explain: s.explain ?? "",
      });
    }
  }
  out.sort((a, b) => a.start - b.start);
  const dedup: Span[] = [];
  for (const s of out) {
    const prev = dedup[dedup.length - 1];
    if (prev && s.start < prev.end) continue;
    dedup.push(s);
  }
  return dedup;
}

export async function analyzeWithClaude(letter: string, apiKey: string): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Analyse this letter and return JSON:\n\n${letter}` }],
  });
  const textBlock = msg.content.find((b) => b.type === "text") as { type: "text"; text: string } | undefined;
  if (!textBlock) throw new Error("Claude returned no text");
  const parsed = JSON.parse(cleanJson(textBlock.text));
  return mergeLLM(letter, parsed, "claude");
}

export async function analyzeWithGemini(letter: string, apiKey: string): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { responseMimeType: "application/json" },
  });
  const res = await model.generateContent(`Analyse this letter and return JSON:\n\n${letter}`);
  const text = res.response.text();
  const parsed = JSON.parse(cleanJson(text));
  return mergeLLM(letter, parsed, "gemini");
}

function mergeLLM(
  letter: string,
  parsed: {
    plainEnglish?: { whatItSays?: string; whatHappensIfYouDoNothing?: string };
    spans?: Array<{ quote: string; tacticId: string; explain?: string }>;
    deadlines?: string[];
    institution?: string | null;
  },
  source: "claude" | "gemini"
): AnalysisResult {
  const base = localAnalyze(letter);
  const llmSpans = parsed.spans ? normalizeSpans(letter, parsed.spans) : [];
  const combined = llmSpans.length >= base.spans.length ? llmSpans : base.spans;

  const counts = new Map<TacticId, number>();
  for (const s of combined) counts.set(s.tacticId, (counts.get(s.tacticId) ?? 0) + 1);
  const tacticCounts = TACTIC_LIST
    .filter((t) => counts.has(t.id))
    .map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
      count: counts.get(t.id) ?? 0,
      oneLiner: t.oneLiner,
      why: t.why,
      counterMove: t.counterMove,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    ...base,
    spans: combined,
    tacticCounts,
    plainEnglish: {
      whatItSays: parsed.plainEnglish?.whatItSays ?? base.plainEnglish.whatItSays,
      whatHappensIfYouDoNothing:
        parsed.plainEnglish?.whatHappensIfYouDoNothing ?? base.plainEnglish.whatHappensIfYouDoNothing,
    },
    deadlines: Array.from(new Set([...(parsed.deadlines ?? []), ...base.deadlines])),
    institution: parsed.institution ?? base.institution,
    sludgeScore: Math.min(100, Math.round((combined.length * 7 + tacticCounts.length * 6) * 1.05)),
    source,
  };
}

export async function runAnalysis(letter: string, keys: LLMKeys): Promise<AnalysisResult> {
  if (keys.anthropic) {
    try {
      return await analyzeWithClaude(letter, keys.anthropic);
    } catch (err) {
      console.warn("Claude analysis failed, trying Gemini:", err);
    }
  }
  if (keys.gemini) {
    try {
      return await analyzeWithGemini(letter, keys.gemini);
    } catch (err) {
      console.warn("Gemini analysis failed, falling back to local engine:", err);
    }
  }
  return localAnalyze(letter);
}
