import type { TacticId } from "./taxonomy";

export interface InstitutionRecord {
  id: string;
  name: string;
  jurisdiction: string;
  sector: "health" | "visa" | "university" | "tenancy" | "benefit";
  xrays: number;
  topTactics: Array<{ tacticId: TacticId; frequency: number }>;
  lastSeen: string;
}

export const SEED_INSTITUTIONS: InstitutionRecord[] = [
  {
    id: "aetna-inc",
    name: "Aetna Inc.",
    jurisdiction: "United States",
    sector: "health",
    xrays: 284,
    topTactics: [
      { tacticId: "vague_denial", frequency: 0.78 },
      { tacticId: "reverse_burden", frequency: 0.64 },
      { tacticId: "hidden_deadline", frequency: 0.52 },
      { tacticId: "intimidating_legalese", frequency: 0.41 },
    ],
    lastSeen: "12 minutes ago",
  },
  {
    id: "ukvi-home-office",
    name: "UK Visas and Immigration (Home Office)",
    jurisdiction: "United Kingdom",
    sector: "visa",
    xrays: 211,
    topTactics: [
      { tacticId: "hidden_deadline", frequency: 0.81 },
      { tacticId: "vague_denial", frequency: 0.69 },
      { tacticId: "obscured_escalation", frequency: 0.55 },
      { tacticId: "passive_blame", frequency: 0.48 },
    ],
    lastSeen: "34 minutes ago",
  },
  {
    id: "uscis",
    name: "U.S. Citizenship and Immigration Services",
    jurisdiction: "United States",
    sector: "visa",
    xrays: 167,
    topTactics: [
      { tacticId: "intimidating_legalese", frequency: 0.72 },
      { tacticId: "redundant_document", frequency: 0.58 },
      { tacticId: "hidden_deadline", frequency: 0.45 },
    ],
    lastSeen: "1 hour ago",
  },
  {
    id: "delhi-university",
    name: "University of Delhi — Grievance Cell",
    jurisdiction: "India",
    sector: "university",
    xrays: 128,
    topTactics: [
      { tacticId: "policy_shield", frequency: 0.74 },
      { tacticId: "obscured_escalation", frequency: 0.61 },
      { tacticId: "dead_end_contact", frequency: 0.44 },
    ],
    lastSeen: "2 hours ago",
  },
  {
    id: "dwp",
    name: "Department for Work & Pensions",
    jurisdiction: "United Kingdom",
    sector: "benefit",
    xrays: 193,
    topTactics: [
      { tacticId: "hidden_deadline", frequency: 0.68 },
      { tacticId: "passive_blame", frequency: 0.59 },
      { tacticId: "vague_denial", frequency: 0.47 },
    ],
    lastSeen: "8 minutes ago",
  },
  {
    id: "blueshield-ca",
    name: "Blue Shield of California",
    jurisdiction: "United States",
    sector: "health",
    xrays: 154,
    topTactics: [
      { tacticId: "reverse_burden", frequency: 0.7 },
      { tacticId: "vague_denial", frequency: 0.66 },
      { tacticId: "policy_shield", frequency: 0.52 },
    ],
    lastSeen: "22 minutes ago",
  },
  {
    id: "axa-uk",
    name: "AXA UK",
    jurisdiction: "United Kingdom",
    sector: "health",
    xrays: 87,
    topTactics: [
      { tacticId: "vague_denial", frequency: 0.62 },
      { tacticId: "intimidating_legalese", frequency: 0.5 },
      { tacticId: "hidden_deadline", frequency: 0.39 },
    ],
    lastSeen: "3 hours ago",
  },
  {
    id: "greater-london-lettings",
    name: "Greater London Lettings Ltd.",
    jurisdiction: "United Kingdom",
    sector: "tenancy",
    xrays: 62,
    topTactics: [
      { tacticId: "time_compression", frequency: 0.74 },
      { tacticId: "passive_blame", frequency: 0.55 },
      { tacticId: "dead_end_contact", frequency: 0.41 },
    ],
    lastSeen: "45 minutes ago",
  },
];

export const TOTAL_SEED_XRAYS = SEED_INSTITUTIONS.reduce((a, b) => a + b.xrays, 0);

export const SAMPLE_LETTERS: Array<{ title: string; subtitle: string; text: string }> = [
  {
    title: "Health Insurance Denial (US)",
    subtitle: "Aetna Inc. — 'not medically necessary'",
    text: `Aetna Inc.
Member Services
P.O. Box 14462, Lexington, KY

${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

Dear Ms. Chen,

We regret to inform you that your claim (Ref: A-884213) for the MRI lumbar spine procedure has been denied. After review by our clinical team, it was determined that the requested service does not meet our criteria for medical necessity at this time.

Pursuant to the terms of your Plan and in accordance with our internal guidelines, it is our policy to require documentation establishing that conservative treatment has been attempted for no less than six (6) weeks prior to advanced imaging. You will need to demonstrate, in writing, that such treatment was undertaken and was unsuccessful.

Should you wish to contest this determination, you must submit a written appeal, together with all supporting documentation, within thirty (30) calendar days from the date of this letter. Failure to respond within this window will result in this decision being treated as final.

Please direct all correspondence to the address above. This is an automated mailbox and is not monitored.

Sincerely,
Aetna Claims Review`,
  },
  {
    title: "UK Visa Refusal",
    subtitle: "UKVI — Standard Visitor",
    text: `UK Visas and Immigration
The Home Office
2 Marsham Street, London SW1P 4DF

${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

Dear Mr. Patel,

Your application for a Standard Visitor visa has been unsuccessful. Having considered your application in accordance with paragraph V 4.2 of Appendix V of the Immigration Rules, the Entry Clearance Officer was not satisfied, on the balance of probabilities, that you are a genuine visitor.

You are required to submit any further evidence you wish to be considered in support of an administrative review within 14 calendar days from the date of this notice. The burden is on you to demonstrate that the decision contains a caseworking error.

Should you wish to make further queries, please contact our office via the online portal. This decision is final in respect of the present application and no further correspondence will be entered into.

Regards,
Entry Clearance Officer
UK Visas and Immigration`,
  },
  {
    title: "University Grievance Dismissal (India)",
    subtitle: "University Grievance Cell",
    text: `University of Delhi
Office of the Registrar
Delhi — 110007

${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

Dear Mr. Sharma,

With reference to your grievance dated last month, the Grievance Redressal Committee has considered your representation. It was determined that your concerns do not warrant further action at this stage.

As per our policy and the aforementioned regulations, please furnish certified copies of the original documents, notarised, within 15 days. We have no record of several items you claim to have submitted; kindly resend.

This office will not entertain any further correspondence on this matter. For any queries, please write to do-not-reply@uod.example.

Yours faithfully,
For Registrar`,
  },
];
