import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-200 bg-parchment-100/50">
      <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-ink-600 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-serif text-base text-ink-900">Leviathan Lens</div>
          <p className="mt-1 text-ink-500">
            A sludge-audit lens for the letters that quietly break people. Paste, read, fight back.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-ink-400">Product</div>
          <ul className="mt-2 space-y-1">
            <li><Link href="/" className="hover:text-ink-900">Analyse a letter</Link></li>
            <li><Link href="/dashboard" className="hover:text-ink-900">Collective Sludge Index</Link></li>
            <li><Link href="/about" className="hover:text-ink-900">About &amp; method</Link></li>
            <li><Link href="/settings" className="hover:text-ink-900">API keys</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-ink-400">Research spine</div>
          <ul className="mt-2 space-y-1">
            <li>
              <a
                className="hover:text-ink-900"
                href="https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/06/fixing-frictions-sludge-audits-around-the-world_1b4bbf1a/5e9bb35c-en.pdf"
                target="_blank"
                rel="noreferrer"
              >
                OECD — Fixing Frictions (2024)
              </a>
            </li>
            <li>
              <a
                className="hover:text-ink-900"
                href="https://www.researchgate.net/publication/338411082_Sludge_Audits"
                target="_blank"
                rel="noreferrer"
              >
                Sunstein — Sludge Audits
              </a>
            </li>
            <li><Link href="/taxonomy" className="hover:text-ink-900">Tactic taxonomy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-200 py-4 text-center text-xs text-ink-400">
        Built for the LEVIATHAN Hackathon. Output is informational; verify citations before sending.
      </div>
    </footer>
  );
}
