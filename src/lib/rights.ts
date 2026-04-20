export type Domain =
  | "health_insurance"
  | "visa"
  | "university"
  | "tenancy"
  | "government_benefit"
  | "generic";

export interface RightsEntry {
  jurisdiction: string;
  title: string;
  summary: string;
  deadline?: string;
  body?: string;
  url: string;
}

export const RIGHTS_CORPUS: Record<Domain, RightsEntry[]> = {
  health_insurance: [
    {
      jurisdiction: "United States",
      title: "ACA §2719 — External Review Right",
      summary:
        "Any denial of a health claim must be accompanied by a written explanation and the right to request an independent external review.",
      deadline: "Request within 4 months of denial.",
      body: "State Insurance Commissioner / Independent Review Organization (IRO)",
      url: "https://www.cms.gov/marketplace/resources/regulations-guidance/appeals",
    },
    {
      jurisdiction: "United Kingdom",
      title: "Financial Ombudsman Service — Insurance Complaints",
      summary:
        "If an insurer rejects a claim, you have the right to a final response within 8 weeks and then escalation to FOS free of charge.",
      deadline: "Escalate to FOS within 6 months of the final response.",
      body: "Financial Ombudsman Service",
      url: "https://www.financial-ombudsman.org.uk/consumers",
    },
    {
      jurisdiction: "India",
      title: "IRDAI Protection of Policyholders' Interests Regulations, 2017",
      summary:
        "Insurer must settle or communicate rejection within 30 days of receiving all documents; the insured may approach the Insurance Ombudsman.",
      deadline: "Complaint to Ombudsman within 1 year of insurer's final reply.",
      body: "Insurance Ombudsman (Council for Insurance Ombudsmen)",
      url: "https://www.cioins.co.in/",
    },
  ],
  visa: [
    {
      jurisdiction: "United Kingdom",
      title: "Administrative Review (Appendix AR, Immigration Rules)",
      summary:
        "Most in-country refusals can be challenged via Administrative Review; caseworker errors must be specifically identified.",
      deadline: "Apply within 14 calendar days of receiving the decision (7 if detained).",
      body: "UK Visas and Immigration — Administrative Review team",
      url: "https://www.gov.uk/ask-for-a-visa-administrative-review",
    },
    {
      jurisdiction: "Schengen Area",
      title: "Article 32(3) Visa Code — Right of Appeal",
      summary:
        "Every Schengen visa refusal must state reasons and the appeal procedure available against the consulate that issued it.",
      deadline: "Typically 30 days; jurisdiction is the issuing member state.",
      body: "Consulate of the issuing Schengen state",
      url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32009R0810",
    },
    {
      jurisdiction: "United States",
      title: "Motion to Reopen / Reconsider (8 CFR §103.5)",
      summary:
        "An unfavourable USCIS decision can be challenged by Form I-290B within strict time limits; new evidence must be material.",
      deadline: "File Form I-290B within 30 days of the decision.",
      body: "USCIS Administrative Appeals Office",
      url: "https://www.uscis.gov/forms/all-forms/notice-of-appeal-or-motion",
    },
  ],
  university: [
    {
      jurisdiction: "United Kingdom",
      title: "OIA — Office of the Independent Adjudicator for Higher Education",
      summary:
        "After exhausting internal procedures (Completion of Procedures letter), students can escalate to OIA for free, independent review.",
      deadline: "Submit to OIA within 12 months of the Completion of Procedures letter.",
      body: "Office of the Independent Adjudicator",
      url: "https://www.oiahe.org.uk/students/",
    },
    {
      jurisdiction: "India",
      title: "UGC (Redressal of Grievances of Students) Regulations, 2023",
      summary:
        "Every HEI must constitute a Students' Grievance Redressal Committee; unresolved grievances escalate to the Ombudsperson within 15 days.",
      deadline: "Appeal to Ombudsperson within 15 days of SGRC decision.",
      body: "University Ombudsperson / UGC",
      url: "https://www.ugc.gov.in/pdfnews/4615381_SGRR-2023.pdf",
    },
  ],
  tenancy: [
    {
      jurisdiction: "United Kingdom — England",
      title: "Section 21 Notice — Housing Act 1988",
      summary:
        "A Section 21 notice must give at least 2 months and comply with prescribed form; defective notices are unenforceable.",
      deadline: "Challenge before possession proceedings are served.",
      body: "County Court / local council housing team",
      url: "https://www.gov.uk/private-renting-evictions",
    },
    {
      jurisdiction: "United States",
      title: "State Tenant Notice-to-Quit Requirements",
      summary:
        "Most states require written notice of a specific duration before a landlord can file for eviction; defective notices can be dismissed.",
      deadline: "Respond before court filing deadline stated on notice.",
      body: "State Bar / Legal Aid housing unit",
      url: "https://www.hud.gov/topics/rental_assistance/tenantrights",
    },
    {
      jurisdiction: "India",
      title: "Model Tenancy Act, 2021 — Rent Authority",
      summary:
        "Disputes between landlord and tenant are to be resolved by the Rent Authority; eviction requires specific statutory grounds.",
      deadline: "File with Rent Authority within 60 days of dispute.",
      body: "State Rent Authority / District Magistrate",
      url: "https://mohua.gov.in/cms/the-model-tenancy-act-2021.php",
    },
  ],
  government_benefit: [
    {
      jurisdiction: "United Kingdom",
      title: "Mandatory Reconsideration — Universal Credit / PIP",
      summary:
        "Before appealing to a tribunal, you must ask DWP for a Mandatory Reconsideration. If still unhappy, appeal to HM Courts & Tribunals.",
      deadline: "Request within 1 month of the decision.",
      body: "DWP then HM Courts & Tribunals Service",
      url: "https://www.gov.uk/mandatory-reconsideration",
    },
    {
      jurisdiction: "United States",
      title: "Social Security Reconsideration & ALJ Hearing",
      summary:
        "SSA denials can be challenged via reconsideration, then ALJ hearing, Appeals Council, and federal court.",
      deadline: "60 days from receipt of decision at each stage.",
      body: "Social Security Administration — Office of Hearings Operations",
      url: "https://www.ssa.gov/benefits/disability/appeal.html",
    },
  ],
  generic: [
    {
      jurisdiction: "Global",
      title: "Right to a Reasoned Decision",
      summary:
        "Most administrative law systems require that a decision affecting a person's rights contain the specific reasons on which it is based. A denial without specific reasons can be challenged on that ground alone.",
      body: "Relevant administrative tribunal or ombudsperson",
      url: "https://www.oecd.org/gov/regulatory-policy/",
    },
    {
      jurisdiction: "Global",
      title: "Right to a Copy of Your File (Data Protection)",
      summary:
        "Under GDPR (EU/UK), DPDP (India), and most data protection regimes, you can request a copy of the personal data and internal notes used to make the decision.",
      deadline: "Institution must respond within 30 days in most regimes.",
      body: "National Data Protection Authority",
      url: "https://gdpr.eu/right-of-access/",
    },
  ],
};

export function detectDomain(text: string): Domain {
  const t = text.toLowerCase();
  if (/(insurance|insurer|claim|policy number|policyholder|prior authori|medically necessary)/i.test(t))
    return "health_insurance";
  if (/(visa|consulate|embassy|immigration|uscis|ukvi|schengen|refusal of entry)/i.test(t))
    return "visa";
  if (/(university|college|student|dean|registrar|grievance|academic|examination|ugc)/i.test(t))
    return "university";
  if (/(tenant|tenancy|landlord|eviction|lease|rent|section 21|notice to quit)/i.test(t))
    return "tenancy";
  if (/(benefit|universal credit|pip|dwp|social security|ssa|welfare|allowance)/i.test(t))
    return "government_benefit";
  return "generic";
}

export function getRightsFor(text: string): { domain: Domain; entries: RightsEntry[] } {
  const domain = detectDomain(text);
  const entries =
    domain === "generic"
      ? RIGHTS_CORPUS.generic
      : [...RIGHTS_CORPUS[domain], ...RIGHTS_CORPUS.generic.slice(0, 1)];
  return { domain, entries };
}
