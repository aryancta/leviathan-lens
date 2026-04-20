import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <div className="font-mono text-xs uppercase tracking-widest text-ink-500">
        404 · page not found
      </div>
      <h1 className="mt-3 font-serif text-5xl text-ink-900 tracking-tight">
        That link led nowhere.
      </h1>
      <p className="mt-3 text-ink-600">
        Which is, funnily enough, one of the tactics we look for. Head back to
        the Lens and paste a letter instead.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Link href="/"><Button>Open the Lens</Button></Link>
        <Link href="/dashboard"><Button variant="outline">Sludge Index</Button></Link>
      </div>
    </div>
  );
}
