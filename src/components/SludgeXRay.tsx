"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TACTICS } from "@/lib/taxonomy";
import type { AnalysisResult, Span } from "@/lib/analyze";
import { cn } from "@/lib/utils";

interface Props {
  result: AnalysisResult;
  scanning?: boolean;
}

type Segment =
  | { type: "plain"; text: string }
  | { type: "span"; text: string; span: Span; index: number };

function buildSegments(letter: string, spans: Span[]): Segment[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let cursor = 0;
  sorted.forEach((s, i) => {
    if (s.start > cursor) {
      out.push({ type: "plain", text: letter.slice(cursor, s.start) });
    }
    out.push({
      type: "span",
      text: letter.slice(s.start, s.end),
      span: s,
      index: i,
    });
    cursor = Math.max(cursor, s.end);
  });
  if (cursor < letter.length) {
    out.push({ type: "plain", text: letter.slice(cursor) });
  }
  return out;
}

export function SludgeXRay({ result, scanning }: Props) {
  const segments = React.useMemo(
    () => buildSegments(result.letter, result.spans),
    [result.letter, result.spans]
  );
  const [active, setActive] = React.useState<number | null>(null);

  return (
    <div className="relative rounded-lg border border-ink-200 bg-[#fbf9f4] shadow-sm overflow-hidden">
      {scanning && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-sludge-red/15 to-transparent animate-scan" />
        </div>
      )}
      <div className="flex items-center justify-between border-b border-ink-200 bg-parchment-100 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-ink-500 font-mono uppercase tracking-widest">
          <span className="h-2 w-2 rounded-full bg-sludge-red animate-pulse" />
          Sludge X-Ray
          <span className="text-ink-300">|</span>
          <span>{result.spans.length} spans</span>
          <span className="text-ink-300">|</span>
          <span>source: {result.source}</span>
        </div>
        <div className="text-xs text-ink-500 font-mono">
          score {result.sludgeScore}/100
        </div>
      </div>
      <div className="relative p-6 md:p-8 font-serif text-[15px] leading-[1.85] text-ink-900 whitespace-pre-wrap">
        {segments.map((seg, i) => {
          if (seg.type === "plain") {
            return <span key={i}>{seg.text}</span>;
          }
          const tactic = TACTICS[seg.span.tacticId];
          const isActive = active === seg.index;
          return (
            <motion.span
              key={i}
              initial={{ backgroundColor: "rgba(0,0,0,0)" }}
              animate={{ backgroundColor: tactic.color + "33" }}
              transition={{ delay: 0.1 + seg.index * 0.07, duration: 0.35 }}
              onMouseEnter={() => setActive(seg.index)}
              onMouseLeave={() => setActive((cur) => (cur === seg.index ? null : cur))}
              onFocus={() => setActive(seg.index)}
              onBlur={() => setActive((cur) => (cur === seg.index ? null : cur))}
              tabIndex={0}
              className={cn(
                "relative cursor-help rounded-sm px-0.5 outline-none transition-shadow",
                isActive && "ring-1"
              )}
              style={{
                borderBottom: `2px solid ${tactic.color}`,
                boxShadow: isActive ? `0 0 0 1px ${tactic.color}` : undefined,
              }}
            >
              {seg.text}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute left-0 top-full z-20 mt-1 w-72 rounded-md border border-ink-200 bg-parchment-50 p-3 text-sm text-ink-800 shadow-lg"
                    role="tooltip"
                  >
                    <div
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: tactic.color }}
                    >
                      {tactic.name}
                    </div>
                    <div className="mt-1 text-[13px] font-sans leading-snug">
                      {tactic.oneLiner}
                    </div>
                    <div className="mt-2 text-[12px] font-sans text-ink-600 leading-snug">
                      {tactic.why}
                    </div>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
