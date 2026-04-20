import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/llm";
import { localAnalyze } from "@/lib/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const letter: string = body?.letter ?? "";
    if (!letter.trim()) {
      return NextResponse.json(
        { error: "Empty letter" },
        { status: 400 }
      );
    }
    if (letter.length > 40000) {
      return NextResponse.json(
        { error: "Letter too long (40k chars max)" },
        { status: 413 }
      );
    }
    const anthropic = req.headers.get("x-user-anthropic-key") ?? undefined;
    const gemini = req.headers.get("x-user-gemini-key") ?? undefined;

    const result = await runAnalysis(letter, {
      anthropic: anthropic || undefined,
      gemini: gemini || undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("analyze route error:", err);
    try {
      const body = await req.json().catch(() => ({ letter: "" }));
      if (body?.letter) {
        return NextResponse.json(localAnalyze(body.letter));
      }
    } catch {}
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analyse failed" },
      { status: 500 }
    );
  }
}
