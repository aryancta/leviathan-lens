import { TACTIC_LIST, TACTICS, type Tactic, type TacticId } from "./taxonomy";
import { detectDomain, getRightsFor, type Domain, type RightsEntry } from "./rights";

export interface Span {
  start: number;
  end: number;
  tacticId: TacticId;
  quote: string;
  explain: string;
}

export interface AnalysisResult {
  letter: string;
  institution: string | null;
  recipient: string | null;
  plainEnglish: {
    whatItSays: string;
    whatHappensIfYouDoNothing: string;
  };
  spans: Span[];
  tacticCounts: Array<{ id: TacticId; name: string; color: string; count: number; oneLiner: string; why: string; counterMove: string }>;
  domain: Domain;
  rights: RightsEntry[];
  deadlines: string[];
  sludgeScore: number;
  source: "local" | "claude" | "gemini";
  generatedAt: string;
}

const INSTITUTION_RX =
  /\b(?:from|issued by|sincerely,?|regards,?|yours (?:faithfully|sincerely),?)\s*\n?\s*([A-Z][A-Za-z0-9&.,'\- ]{2,60}(?:Insurance|Hospital|Health|Group|Bank|Ltd\.?|Limited|Inc\.?|LLP|University|College|Embassy|Consulate|Services|Authority|Department|Ministry|Office|Council))\b/;

function findInstitution(letter: string): string | null {
  const m = letter.match(INSTITUTION_RX);
  if (m && m[1]) return m[1].trim();
  const fallback = letter.match(
    /\b([A-Z][A-Za-z&.\- ]{2,40}(?:Insurance|Health|University|College|Embassy|Consulate|Bank|Authority|Department|Services|Council|Hospital))\b/
  );
  return fallback ? fallback[1].trim() : null;
}

function findRecipient(letter: string): string | null {
  const m = letter.match(/^\s*Dear\s+(?:Mr\.?|Ms\.?|Mrs\.?|Dr\.?|Prof\.?)?\s*([A-Z][A-Za-z\-' ]{1,40})/m);
  return m ? m[1].trim().replace(/[,:]$/, "") : null;
}

function extractDeadlines(letter: string): string[] {
  const patterns = [
    /within\s+(?:a\s+period\s+of\s+)?\d+\s*(?:calendar|business|working)?\s*days/gi,
    /within\s+(?:seven|ten|fourteen|fifteen|twenty|thirty|sixty)\s*\(?\d*\)?\s*(?:calendar|business|working)?\s*days/gi,
    /no later than [A-Z][a-z]+ \d{1,2},? \d{4}/gi,
    /by the end of [A-Z][a-z]+ \d{1,2}/gi,
    /must be received by [A-Z][a-z]+ \d{1,2}/gi,
  ];
  const out: string[] = [];
  for (const rx of patterns) {
    const matches = letter.match(rx);
    if (matches) out.push(...matches.map((m) => m.trim()));
  }
  return Array.from(new Set(out));
}

function findAllSpans(letter: string, tactic: Tactic): Span[] {
  const found: Span[] = [];
  const lower = letter.toLowerCase();
  for (const signal of tactic.signals) {
    const needle = signal.toLowerCase();
    let idx = 0;
    while (idx < lower.length) {
      const at = lower.indexOf(needle, idx);
      if (at === -1) break;
      const sentenceStart = Math.max(
        lower.lastIndexOf(".", at - 1),
        lower.lastIndexOf("\n", at - 1)
      ) + 1;
      let sentenceEnd = at + needle.length;
      while (
        sentenceEnd < letter.length &&
        letter[sentenceEnd] !== "." &&
        letter[sentenceEnd] !== "\n" &&
        sentenceEnd - at < 160
      ) {
        sentenceEnd++;
      }
      if (sentenceEnd < letter.length) sentenceEnd++;
      const quote = letter.slice(sentenceStart, sentenceEnd).trim();
      found.push({
        start: sentenceStart,
        end: sentenceEnd,
        tacticId: tactic.id,
        quote,
        explain: tactic.oneLiner,
      });
      idx = at + needle.length;
    }
  }
  return found;
}

function dedupeAndMergeSpans(spans: Span[]): Span[] {
  if (spans.length === 0) return spans;
  spans.sort((a, b) => a.start - b.start || b.end - a.end);
  const out: Span[] = [];
  for (const s of spans) {
    const last = out[out.length - 1];
    if (last && s.start < last.end && s.tacticId === last.tacticId) {
      continue;
    }
    out.push(s);
  }
  return out;
}

function makePlainEnglish(letter: string, domain: Domain, tacticsFound: TacticId[]): AnalysisResult["plainEnglish"] {
  const hasDenial =
    /(denied|rejected|refused|unsuccessful|regret to inform|unable to approve)/i.test(letter);
  const hasDeadline = tacticsFound.includes("hidden_deadline");

  const what =
    domain === "health_insurance"
      ? "Your insurer has refused to pay for the claim or treatment described in the letter. They are relying on a general statement that it is 'not medically necessary' or 'does not meet criteria' rather than naming a specific policy clause."
      : domain === "visa"
      ? "Your visa or immigration application has been refused. The letter cites the decision but avoids tying it to a specific, falsifiable paragraph of the rules."
      : domain === "university"
      ? "Your grievance or academic appeal has been dismissed at an internal stage. The institution is treating its own policy as if it were final law."
      : domain === "tenancy"
      ? "Your landlord or property manager is attempting to end the tenancy or withhold something owed to you. Many of these notices are defective in form — they must meet specific statutory requirements."
      : domain === "government_benefit"
      ? "A government body has refused a benefit or payment you applied for. There is almost always a mandatory reconsideration or tribunal route that the letter under-states."
      : hasDenial
      ? "An institution is refusing something you asked for, while avoiding a specific rule or clause on which to anchor the refusal."
      : "This letter is assigning you an obligation without clearly stating the authority or the rule that creates it.";

  const doNothing = hasDeadline
    ? "If you do nothing before the deadline hidden in the letter, they can treat the matter as closed and make it much harder to re-open. The deadline is the single most important fact in this letter."
    : "If you do nothing, the institution treats the refusal as final and closes the file. Your statutory right to escalation often has its own clock — starting the moment the letter is dated, not when you read it.";

  return { whatItSays: what, whatHappensIfYouDoNothing: doNothing };
}

export function localAnalyze(letter: string): AnalysisResult {
  const domain = detectDomain(letter);
  const spansRaw = TACTIC_LIST.flatMap((t) => findAllSpans(letter, t));
  const spans = dedupeAndMergeSpans(spansRaw);
  const counts = new Map<TacticId, number>();
  for (const s of spans) counts.set(s.tacticId, (counts.get(s.tacticId) ?? 0) + 1);

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

  const { entries: rights } = getRightsFor(letter);
  const deadlines = extractDeadlines(letter);
  const pe = makePlainEnglish(letter, domain, Array.from(counts.keys()));
  const sludgeScore = Math.min(100, Math.round((spans.length * 7 + tacticCounts.length * 6) * 1.05));

  return {
    letter,
    institution: findInstitution(letter),
    recipient: findRecipient(letter),
    plainEnglish: pe,
    spans,
    tacticCounts,
    domain,
    rights,
    deadlines,
    sludgeScore,
    source: "local",
    generatedAt: new Date().toISOString(),
  };
}

export function draftResponseLetter(result: AnalysisResult, userName = "[Your Name]"): string {
  const inst = result.institution ?? "[Institution]";
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const tacticLines = result.tacticCounts.slice(0, 4).map((tc) => {
    const t = TACTICS[tc.id];
    return `- Regarding "${t.name}": ${t.counterMove}`;
  });
  const rightLine = result.rights[0]
    ? `I am relying on ${result.rights[0].title} (${result.rights[0].jurisdiction}). ${result.rights[0].summary}`
    : "I am relying on the general administrative-law principle that a decision affecting my rights must give specific reasons.";
  const deadlineLine = result.deadlines[0]
    ? `I note the window you have stated ("${result.deadlines[0]}"). I am responding within it and request written confirmation of receipt.`
    : "Please confirm in writing the statutory window within which you must respond to this letter.";

  return [
    `${today}`,
    "",
    `To: ${inst}`,
    `Subject: Formal response to your communication of [date of original letter]`,
    "",
    `Dear Sir or Madam,`,
    "",
    `I am writing in response to your letter of [date]. Having reviewed your communication carefully, I do not accept the decision as currently reasoned, and I am placing the following on record.`,
    "",
    `1. Request for specific reasons. Your letter does not identify the precise clause, criterion, or rule applied to my case. I ask that within your stated response window you provide (a) the specific policy section, statute, or contract clause relied on, and (b) the identity and designation of the officer who made the decision.`,
    "",
    `2. Rights I am exercising. ${rightLine} I reserve all further rights of escalation, including to the appropriate regulator or ombudsperson.`,
    "",
    `3. Observations on your letter. A preliminary review indicates several features that are recognised in administrative-friction ("sludge") research:`,
    ...(tacticLines.length ? tacticLines : ["- The letter avoids naming a specific falsifiable reason; please correct this in your response."]),
    "",
    `4. Deadlines. ${deadlineLine}`,
    "",
    `5. Documents. All documents previously submitted remain on file; if any item is missing, please identify it precisely (filename / date received) rather than issuing a general re-submission request.`,
    "",
    `I am responding in good faith and expect the same in return. Please treat this as a formal notice that, absent a reasoned written response within the applicable statutory window, I intend to escalate to the relevant independent body.`,
    "",
    `Yours faithfully,`,
    userName,
    "",
    `— Draft generated with Leviathan Lens. Verify citations before sending.`,
  ].join("\n");
}
