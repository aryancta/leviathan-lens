import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tint?: string;
}

export function Badge({ className, tint, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
        tint ? "text-parchment-50" : "border-ink-200 bg-parchment-100 text-ink-800",
        className
      )}
      style={
        tint
          ? { backgroundColor: tint, borderColor: tint, ...style }
          : style
      }
      {...props}
    />
  );
}
