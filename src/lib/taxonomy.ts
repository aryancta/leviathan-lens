export type TacticId =
  | "vague_denial"
  | "hidden_deadline"
  | "reverse_burden"
  | "obscured_escalation"
  | "redundant_document"
  | "intimidating_legalese"
  | "passive_blame"
  | "dead_end_contact"
  | "policy_shield"
  | "time_compression";

export interface Tactic {
  id: TacticId;
  name: string;
  color: string;
  oneLiner: string;
  why: string;
  signals: string[];
  counterMove: string;
}

export const TACTICS: Record<TacticId, Tactic> = {
  vague_denial: {
    id: "vague_denial",
    name: "Vague Denial Reason",
    color: "#b4322c",
    oneLiner: "A refusal with no specific, falsifiable reason.",
    why: "If you cannot name the rule that was applied, you cannot contest it. Opacity is the point.",
    signals: [
      "not medically necessary",
      "does not meet criteria",
      "insufficient",
      "we regret to inform",
      "application has been unsuccessful",
      "does not meet our requirements",
      "not satisfied",
      "at this time",
      "unable to approve",
      "has been denied",
      "not eligible",
    ],
    counterMove:
      "Demand the exact clause, policy section, or criterion relied on, in writing, within the statutory response window.",
  },
  hidden_deadline: {
    id: "hidden_deadline",
    name: "Hidden Deadline",
    color: "#c9861f",
    oneLiner: "A short appeal window buried in body text or footer.",
    why: "Sludge Audit literature: short, buried deadlines are the single most effective way to collapse appeal rates.",
    signals: [
      "within 14 days",
      "within 15 days",
      "within 30 days",
      "within 10 days",
      "within 7 days",
      "within thirty (30) days",
      "must be received",
      "no later than",
      "by the date above",
      "from the date of this letter",
      "calendar days",
      "business days",
    ],
    counterMove:
      "Record the postmark. File a short 'notice of intent to appeal' before the deadline even if the full submission follows later.",
  },
  reverse_burden: {
    id: "reverse_burden",
    name: "Reverse Burden of Proof",
    color: "#3b4a79",
    oneLiner: "You must disprove their claim, rather than they prove theirs.",
    why: "Shifts the cost of evidence onto the person least able to bear it. A classic regulatory sludge pattern.",
    signals: [
      "you must provide",
      "you are required to submit",
      "you will need to demonstrate",
      "the burden is on you",
      "please furnish",
      "kindly provide",
      "documentation establishing",
      "proof that",
      "evidence showing",
    ],
    counterMove:
      "Quote back the statute or policy that places the evidentiary burden on the institution; request their internal file and notes.",
  },
  obscured_escalation: {
    id: "obscured_escalation",
    name: "Obscured Escalation Path",
    color: "#6b2f5c",
    oneLiner: "No named regulator, ombudsperson, or next step.",
    why: "If the letter does not name who to escalate to, most recipients stop. Silence is a tactic.",
    signals: [
      "internal review",
      "final decision",
      "no further correspondence",
      "this decision is final",
      "you may contact our office",
      "further queries",
      "should you wish to",
    ],
    counterMove:
      "Identify the statutory ombudsperson or regulator independently and cc them on your response.",
  },
  redundant_document: {
    id: "redundant_document",
    name: "Redundant Document Demand",
    color: "#2f6b68",
    oneLiner: "Asks for documents the user has already submitted.",
    why: "Forces the user to re-do work, increasing the chance they abandon the claim.",
    signals: [
      "please resubmit",
      "kindly resend",
      "we did not receive",
      "we have no record",
      "original documents",
      "certified copies",
      "attested copies",
      "notarised",
    ],
    counterMove:
      "Enclose proof of original submission (tracking number, timestamp) and request written confirmation of what is actually missing.",
  },
  intimidating_legalese: {
    id: "intimidating_legalese",
    name: "Intimidating Legalese",
    color: "#445065",
    oneLiner: "Latin, statute numbers, and dense clauses used as deterrent.",
    why: "Designed to make the recipient feel out-gunned and drop the matter before reading further.",
    signals: [
      "pursuant to",
      "hereinafter",
      "whereas",
      "notwithstanding",
      "aforementioned",
      "in accordance with",
      "sub-section",
      "u/s",
      "section 2(",
      "vide our letter",
    ],
    counterMove:
      "Translate each cited clause into plain English and force them to re-state the clause back in context.",
  },
  passive_blame: {
    id: "passive_blame",
    name: "Passive Voice Blame-Shift",
    color: "#8a5a2b",
    oneLiner: "'Your claim was denied' — but by whom, under what authority?",
    why: "Passive voice hides the decision-maker so there is no human to address and no accountability.",
    signals: [
      "has been denied",
      "was not approved",
      "has been rejected",
      "it was decided",
      "was determined",
      "has been closed",
      "was found to be",
    ],
    counterMove:
      "Ask for the name and designation of the officer who made the decision and the date it was made.",
  },
  dead_end_contact: {
    id: "dead_end_contact",
    name: "Dead-End Contact",
    color: "#4a5a3b",
    oneLiner: "A do-not-reply address or unstaffed phone line.",
    why: "Signals that no human is actually on the other end — so the recipient gives up.",
    signals: [
      "do not reply",
      "do-not-reply",
      "noreply@",
      "this is an automated",
      "this mailbox is not monitored",
      "for internal use only",
    ],
    counterMove:
      "Send your reply by post with tracking to the registered office, and cc a named officer found via the institution's public records.",
  },
  policy_shield: {
    id: "policy_shield",
    name: "Policy Shield",
    color: "#7a3b3b",
    oneLiner: "'It is our policy' used as if it were law.",
    why: "Internal policy is not statute. Conflating the two deters people who don't know the difference.",
    signals: [
      "it is our policy",
      "company policy",
      "as per our policy",
      "internal guidelines",
      "our standard procedure",
    ],
    counterMove:
      "Request a copy of the written policy and the statute or contract clause it is derived from.",
  },
  time_compression: {
    id: "time_compression",
    name: "Time Compression",
    color: "#b4322c",
    oneLiner: "Urgent tone combined with a non-urgent response window.",
    why: "Pressures the recipient into rushed, error-prone responses — which are then used against them.",
    signals: [
      "immediate attention",
      "urgent",
      "time-sensitive",
      "act now",
      "failure to respond",
      "will result in",
    ],
    counterMove:
      "Breathe. Confirm the actual statutory deadline and answer within it, not within their manufactured one.",
  },
};

export const TACTIC_LIST: Tactic[] = Object.values(TACTICS);
