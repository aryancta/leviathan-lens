import { NextResponse } from "next/server";
import { draftResponseLetter } from "@/lib/analyze";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = body?.result;
    const userName: string = body?.userName ?? "[Your Name]";
    if (!result?.letter) {
      return NextResponse.json({ error: "Missing analysis" }, { status: 400 });
    }
    const draft = draftResponseLetter(result, userName);
    return NextResponse.json({ draft });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Draft failed" },
      { status: 500 }
    );
  }
}
